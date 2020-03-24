import numpy as np
import re
import requests
from bs4 import BeautifulSoup


class Collector:
    leaders = []
    keywords = []
    db = ""
    source_handler = ""
    logger = ""

    def __init__(self, logger, source, db, collection):
        self.logger = logger
        self.db = db
        leaders = self.db.get_collection(collection)
        for leader in leaders:
            self.leaders.append(leader)
        keywords = self.db.get_collection("keywords")
        for keyword in keywords:
            self.keywords.append(keyword['word'].lower())
        self.source_handler = source
        self.logger.send_message_to_logfile("- Collector created")

    def refresh_collector_input(self):
        leaders_new = []
        keywords_new = []
        leaders = self.db.get_collection("opinion_leaders")
        for leader in leaders:
            leaders_new.append(leader)
        keywords = self.db.get_collection("keywords")
        for keyword in keywords:
            keywords_new.append(keyword['word'].lower())
        self.leaders = leaders_new
        self.keywords = keywords_new
        self.logger.send_message_to_logfile("- Collector refreshed input data")

    def collect_tweets(self):
        self.logger.send_message_to_logfile("- Start collecting")
        for leader in self.leaders:
            if leader['lock'] == False:
                self.db.lock_opinion_leader(leader['_id'])
                self.logger.send_message_to_logfile("\n- Handles: {0}".format(leader['full_name']))
                if leader['new_leader'] == False:
                    self.logger.send_message_to_logfile("- Not a new leader")
                    if leader['level_of_certainty'] > 0:
                        self.collect_and_save_tweets(leader['twitter_id'])
                    else:
                        self.logger.send_message_to_logfile("- Low level of certainty. Move to black list")
                        self.db.insert_leader_details_empty("blacklist", leader['full_name'])
                else:
                    self.logger.send_message_to_logfile("- New leader. Collecting init details")
                    self.collect_leader_init_details(leader['_id'], leader['full_name'])
                self.db.unlock_opinion_leader(leader['_id'])
            else:
                self.logger.send_message_to_logfile("\n- Handles: {0}\n- Locked. Moving to next one.".format(leader['full_name']))

    def collect_connections(self):
        self.logger.send_message_to_slack("- Start collecting")
        for leader in self.leaders:
            if leader['lock'] == False:
                self.db.lock_opinion_leader(leader['_id'])
                self.logger.send_message_to_logfile("\n- Handles: {0}".format(leader['full_name']))
                if leader['new_leader'] == False:
                    self.logger.send_message_to_logfile("- Not a new leader")
                    if leader['level_of_certainty'] > 0:
                        self.collect_and_save_connections(leader['twitter_id'])
                    else:
                        self.logger.send_message_to_logfile("- Low level of certainty. Move the leader to black list")
                        self.db.insert_leader_details_empty("blacklist", leader['full_name'])
                else:
                    self.logger.send_message_to_logfile("- New leader. Collecting init details")
                    self.collect_leader_init_details(leader['_id'], leader['full_name'])
                self.db.unlock_opinion_leader(leader['_id'])
            else:
                self.logger.send_message_to_logfile("\n- Handles: {0}\n- Locked. Moving to next one.".format(leader['full_name']))

    def collect_leader_init_details(self, leader_db_id, leader_fullName):
        leader_info = self.source_handler.search_twitter_name(leader_fullName)
        # Checks of more than 1 name came up
        if len(leader_info) == 1:
            for details in leader_info:
                profile_image = details.profile_image_url[
                                0:details.profile_image_url.find('_normal')] + "_400x400" + details.profile_image_url[
                                                                                            details.profile_image_url.find(
                                                                                                '.jpeg'):len(
                                                                                                details.profile_image_url)]
                self.db.update_leader_details_regular("opinion_leaders", leader_db_id, details.id, details.screen_name,
                                                      details.location, details.description, details.followers_count,
                                                      details.friends_count, details.created_at, details.statuses_count,
                                                      False, 10, profile_image)
        elif len(leader_info) == 0:
            self.logger.send_message_to_logfile("- Collector did not find any person with that name")
            self.db.insert_leader_details_empty("blacklist", leader_fullName)
        elif len(leader_info) > 1:
            self.logger.send_message_to_logfile("- Search for screen name came up with more than 1 result".format(
                leader_fullName))
            required_id = self.resolve_search_leader_multiple_results(leader_info, leader_fullName)
            try:
                if required_id['id'] == 0:
                    self.logger.send_message_to_logfile("- Issue found while resolving the conflict. error 100")
                    self.db.insert_leader_details_empty("blacklist", leader_fullName)
            except:
                self.logger.send_message_to_logfile("- Issue found while resolving the conflict. error 100")
                self.db.insert_leader_details_empty("blacklist", leader_fullName)
            else:
                for details in leader_info:
                    if details.id == required_id["id"]:
                        profile_image = details.profile_image_url[0:details.profile_image_url.find(
                            '_normal')] + "_400x400" + details.profile_image_url[
                                                       details.profile_image_url.find('.jpeg'):len(
                                                           details.profile_image_url)]
                        if required_id["level_of_certainty"] < 7:
                            self.db.insert_leader_details_regular("suggestions", details.id,
                                                                  details.screen_name,
                                                                  leader_fullName,
                                                                  details.location, details.description,
                                                                  details.followers_count,
                                                                  details.friends_count, details.created_at,
                                                                  details.statuses_count,
                                                                  False, required_id["level_of_certainty"],
                                                                  profile_image)
                        else:
                            self.db.update_leader_details_regular("opinion_leaders", leader_db_id, details.id,
                                                              details.screen_name,
                                                              details.location, details.description,
                                                              details.followers_count,
                                                              details.friends_count, details.created_at,
                                                              details.statuses_count,
                                                              False, required_id["level_of_certainty"], profile_image)

    def refresh_leaders_init_details(self):
        for leader in self.leaders:
            self.logger.send_message_to_logfile("- Handles: {0}".format(leader['full_name']))
            self.logger.send_message_to_logfile("- Refresh leader init details")
            self.collect_leader_init_details(leader['_id'], leader['full_name'])

    def resolve_search_leader_multiple_results(self, leaders_info, fullName_to_search):
        np_kw_array = np.array(self.keywords)
        proposed_id = []
        level_of_certainty = 0  # scale of 0 to 10
        for leader in leaders_info:
            proposed_description = leader.description.lower()
            proposed_description = re.sub(r"[^a-zA-Z0-9]+", ' ', proposed_description)
            np_description_array = np.array(proposed_description.split(' '))
            if len(np.intersect1d(np_kw_array, np_description_array)) > 0:
                level_of_certainty += 5
            if leader.name == fullName_to_search:
                level_of_certainty += 2
            proposed_id.append({"id": leader.id, "level_of_certainty": level_of_certainty})
            level_of_certainty = 0

        # Check for the maximum level of certainty
        max_level = 0
        returned_id = [{"id": 0, "level_of_certainty": 0}]
        for id in proposed_id:
            if id["level_of_certainty"] > max_level:
                max_level = id["level_of_certainty"]
                returned_id = id
        return returned_id

    def collect_and_save_tweets(self, leader_twitter_id):
        self.logger.send_message_to_logfile("- Collecting posts")
        results = self.source_handler.get_tweets(leader_twitter_id)
        for post in results:
            if not self.check_if_post_exists_in_db(post.id):
                in_reply_to_status_id = "None"
                in_reply_to_status_text = "None"
                in_reply_to_status_user_id = "None"
                quoted_status_id = "None"
                quoted_status_text = "None"
                quoted_status_user_id = "None"
                retweeted_status_id = "None"
                retweeted_status_text = "None"
                retweeted_status_user_id = "None"
                post_id = post.id
                post_text = post.full_text
                date_created = post.created_at
                try:
                    in_reply_to_status_id = post.in_reply_to_status_id
                    if in_reply_to_status_id != None:
                        in_reply_to_status_text = self.source_handler.get_specific_tweet(in_reply_to_status_id).text
                        in_reply_to_status_user_id = post.in_reply_to_screen_name
                except Exception as e:
                    pass

                try:
                    quoted_status_id = post.quoted_status_id
                    if post_text[0:2] == "RT":
                        tweet = self.source_handler.get_specific_tweet(quoted_status_id)
                        quoted_status_text = tweet.text
                        quoted_status_user_id = tweet.screen_name
                    else:
                        quoted_status_text = post.quoted_status.full_text
                        quoted_status_user_id = post.quoted_status.user.screen_name
                except Exception as e:
                    pass

                try:
                    retweeted_status_id = post.retweeted_status.id
                    retweeted_status_text = post.retweeted_status.full_text
                    post_text = post_text[0:post_text.find(':') + 2]
                    post_text += post.retweeted_status.full_text
                    retweeted_status_user_id = post.retweeted_status.user.screen_name
                except Exception as e:
                    pass

                self.db.insert_postV2("posts", leader_twitter_id, post_id, post_text, date_created,
                                      in_reply_to_status_id, in_reply_to_status_text, in_reply_to_status_user_id,
                                      quoted_status_id, quoted_status_text, quoted_status_user_id, retweeted_status_id,
                                      retweeted_status_text, retweeted_status_user_id)
                self.logger.send_message_to_logfile("- New post found and collected")

    def check_if_post_exists_in_db(self, tweet_id):
        query = {"post_id": tweet_id}
        result = self.db.get_collection_with_filter("posts", query)
        if result.count() == 0:
            return False
        else:
            return True

    def get_retweet_text(self, url):
        """ This method is for collecting the retweet data """
        page = requests.get(url)
        soup = BeautifulSoup(page.text, 'html.parser')
        for item in soup.find_all('title'):
            self.logger.send_message_to_logfile(item.get_text())

    def collect_and_save_connections(self, leader_twitter_id):
        """
        Search in every opinion leader's twitter account
        for followers from the rest of the opinion leaders in the DB
        """
        self.logger.send_message_to_logfile("- Search for connection to another opinion leaders")
        followers_array = self.source_handler.get_following_list(leader_twitter_id)
        connection_arr = []
        for follower in followers_array:
            for leader in self.leaders:
                try:
                    if follower == leader['twitter_id']:
                        connection_arr.append(follower)
                except:
                    pass
        self.db.insert_connections("opinion_leaders", leader_twitter_id, connection_arr)