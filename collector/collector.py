import datetime
import os
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
    collection = ""
    MAX_LEVEL_OF_CERTAINTY = ""
    AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY = ""
    AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY = ""
    AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY = ""
    MIN_LEVEL_OF_CERTAINTY = ""

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
        self.MAX_LEVEL_OF_CERTAINTY = int(os.getenv('MAX_LEVEL_OF_CERTAINTY'))
        self.AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY = int(os.getenv('AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY'))
        self.AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY = int(os.getenv('AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY'))
        self.AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY = int(os.getenv('AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY'))
        self.MIN_LEVEL_OF_CERTAINTY = int(os.getenv('MIN_LEVEL_OF_CERTAINTY'))
        self.collection = collection

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
                try:
                    self.logger.send_message_to_logfile("\n- Handles: {0}".format(leader['full_name']))
                except:
                    self.logger.send_message_to_logfile("\n- Handles: {0}".format(leader['twitter_screen_name']))
                if leader['new_leader'] == False:
                    self.logger.send_message_to_logfile("- Not a new leader")
                    self.collect_and_save_tweets(leader['twitter_id'])
                else:
                    self.logger.send_message_to_logfile("- New leader. Collecting init details")
                    try:
                        self.collect_leader_init_details(leader, leader['twitter_screen_name'])
                    except:
                        self.collect_leader_init_details(leader)
                self.db.unlock_opinion_leader(leader['_id'])
            else:
                try:
                    self.logger.send_message_to_logfile("\n- Handles: {0}\n- Locked. Moving to next one.".format(leader['full_name']))
                except:
                    self.logger.send_message_to_logfile(
                        "\n- Handles: {0}\n- Locked. Moving to next one.".format(leader['twitter_screen_name']))

    def collect_connections(self):
        current_time = datetime.datetime.now()
        """ First cycle only for the new members in the community """
        self.logger.send_message_to_logfile("- First cycle: Search connections for new members in the cummunity")
        temp = self.leaders
        self.leaders = []
        leaders = self.db.get_collection_with_filter(self.collection,{'$or': [{'community_following': {'$exists': False}},{'community_following': []}]})
        for leader in leaders:
            self.leaders.append(leader)
        self.logger.send_message_to_slack("- Start collecting")
        for leader in self.leaders:
            if leader['lock'] == False:
                self.db.lock_opinion_leader(leader['_id'])
                try:
                    self.logger.send_message_to_logfile("\n- Handles: {0}".format(leader['full_name']))
                except:
                    self.logger.send_message_to_logfile("\n- Handles: {0}".format(leader['twitter_screen_name']))
                if leader['new_leader'] == False:
                    self.logger.send_message_to_logfile("- Not a new leader")
                    self.collect_and_save_connections(leader, current_time)
                else:
                    self.logger.send_message_to_logfile("- New leader. Collecting init details")
                    self.collect_leader_init_details(leader)
                self.db.unlock_opinion_leader(leader['_id'])
            else:
                try:
                    self.logger.send_message_to_logfile("\n- Handles: {0}\n- Locked. Moving to next one.".format(leader['full_name']))
                except:
                    self.logger.send_message_to_logfile(
                        "\n- Handles: {0}\n- Locked. Moving to next one.".format(leader['twitter_screen_name']))

        """ Second cycle for the rest of the community """
        self.logger.send_message_to_logfile("- Second cycle: Search connections for the rest of the cummunity")
        leaders = self.db.get_collection_with_filter(self.collection,{'$or': [{'community_following':[]}, {'community_following.found_date': {'$not': {'$eq': current_time}}}]})
        self.leaders = temp
        for leader in leaders:
            if leader['lock'] == False:
                self.db.lock_opinion_leader(leader['_id'])
                try:
                    self.logger.send_message_to_logfile("\n- Handles: {0}".format(leader['full_name']))
                except:
                    self.logger.send_message_to_logfile("\n- Handles: {0}".format(leader['twitter_screen_name']))
                if leader['new_leader'] == False:
                    self.logger.send_message_to_logfile("- Not a new leader")
                    self.collect_and_save_connections(leader, current_time)
                else:
                    self.logger.send_message_to_logfile("- New leader. Collecting init details")
                    self.collect_leader_init_details(leader['_id'], leader['full_name'])
                self.db.unlock_opinion_leader(leader['_id'])
            else:
                try:
                    self.logger.send_message_to_logfile(
                        "\n- Handles: {0}\n- Locked. Moving to next one.".format(leader['full_name']))
                except:
                    self.logger.send_message_to_logfile(
                        "\n- Handles: {0}\n- Locked. Moving to next one.".format(leader['twitter_screen_name']))

    def collect_leader_init_details(self, leader, twitter_screen_name=""):
        if twitter_screen_name:
            leader_info = self.source_handler.search_twitter_name(twitter_screen_name)
            results_length = len(leader_info)
        else:
            leader_info = self.source_handler.search_twitter_name(leader['full_name'])
            results_length = len(leader_info)
        # Checks of more than 1 name came up
        if leader_info:
            if results_length == 1:
                for details in leader_info:
                    profile_image = details.profile_image_url[0:details.profile_image_url.find(
                        '_normal')] + "_400x400" + details.profile_image_url[
                                                   details.profile_image_url.rfind('.'):len(details.profile_image_url)]
                    self.db.update_leader_details_regular(self.collection, leader['_id'], details.id, details.screen_name,
                                                          details.location, details.description, details.followers_count,
                                                          details.friends_count, details.created_at, details.statuses_count,
                                                          False, 10, profile_image)
                    self.logger.send_message_to_logfile("- Search came up with only 1 result. Insert into community")
            elif results_length == 0:
                self.logger.send_message_to_logfile("- Collector did not find any person with that name")
                self.db.insert_leader_details_empty("blacklist", leader['full_name'])
            elif results_length > 1:
                self.logger.send_message_to_logfile("- Search for screen name came up with more than 1 result".format(
                    leader['full_name']))
                required_id = self.resolve_search_leader_multiple_results(leader_info, leader['full_name'])
                try:
                    if required_id['id'] == 0:
                        self.logger.send_message_to_logfile("- Issue found while resolving the conflict. error 100")
                        self.db.insert_leader_details_empty("blacklist", leader['full_name'])
                except:
                    self.logger.send_message_to_logfile("- Issue found while resolving the conflict. error 100")
                    self.db.insert_leader_details_empty("blacklist", leader['full_name'])
                else:
                    for details in leader_info:
                        if details.id == required_id["id"]:
                            profile_image = details.profile_image_url[0:details.profile_image_url.find(
                                '_normal')] + "_400x400" + details.profile_image_url[details.profile_image_url.rfind('.'):len(details.profile_image_url)]
                            if required_id["level_of_certainty"] < self.AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY and required_id["level_of_certainty"] >= self.AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY:
                                self.db.move_leader_from_community_to_suggestions(self.collection, leader['_id'], details.id,
                                                                      details.screen_name,
                                                                      details.location, details.description,
                                                                      details.followers_count,
                                                                      details.friends_count, details.created_at,
                                                                      details.statuses_count,
                                                                      False, required_id["level_of_certainty"],
                                                                      profile_image,leader['full_name'], leader['internal_create_date'])
                                self.logger.send_message_to_logfile("- Moved to suggestions collection")
                            elif required_id["level_of_certainty"] > self.AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY:
                                self.db.update_leader_details_regular(self.collection, leader['_id'], details.id,
                                                                  details.screen_name,
                                                                  details.location, details.description,
                                                                  details.followers_count,
                                                                  details.friends_count, details.created_at,
                                                                  details.statuses_count,
                                                                  False, 10, profile_image)
                                self.logger.send_message_to_logfile("- Inserted into the community")
                            else:
                                self.db.move_leader_from_community_to_blacklist(self.collection, leader['_id'])
                                self.logger.send_message_to_logfile("- Low level of certainty. Move to blacklist")
        else:
            self.db.move_leader_from_community_to_blacklist(self.collection, leader['_id'])
            self.logger.send_message_to_logfile("- Leader was not to be found. error 101")
            self.logger.send_message_to_logfile("- Moved to blacklist")


    def refresh_leaders_init_details(self):
        for leader in self.leaders:
            self.logger.send_message_to_logfile("- Handles: {0}".format(leader['full_name']))
            self.logger.send_message_to_logfile("- Refresh leader init details")
            self.collect_leader_init_details(leader['_id'], leader['full_name'])

    def resolve_search_leader_multiple_results(self, leaders_info, fullName_to_search):
        np_kw_array = np.array(self.keywords)
        proposed_id = []
        level_of_certainty = 0  # scale of 0 to 10

        # First check: If leader description contains one or more internal keywords
        # If it is it receives 'AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY' points
        # Second check: If leader's name is the same as written in the DB
        # If it is it receives 'AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY' points
        for leader in leaders_info:
            proposed_description = leader.description.lower()
            proposed_description = re.sub(r"[^a-zA-Z0-9]+", ' ', proposed_description)
            np_description_array = np.array(proposed_description.split(' '))
            if len(np.intersect1d(np_kw_array, np_description_array)) > 0:
                level_of_certainty += self.AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY
            if leader.name == fullName_to_search:
                level_of_certainty += self.AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY
            proposed_id.append({"id": leader.id, "level_of_certainty": level_of_certainty, "followers": leader.followers_count})
            level_of_certainty = 0

        # Third check: The person with the highest value of followers
        # Will receive 'AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY' points
        max_num = 0
        max_index = 0
        for i in range(len(proposed_id)):
            if proposed_id[i]['followers'] > max_num:
                max_num = proposed_id[i]['followers']
                max_index = i
        proposed_id[max_index]['level_of_certainty'] += self.AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY

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
                retweet_count = post.retweet_count
                retweeted = post.retweeted
                likes = post.favorite_count
                try:
                    in_reply_to_status_id = post.in_reply_to_status_id
                    if in_reply_to_status_id != None:
                        post2 = self.source_handler.get_specific_tweet(in_reply_to_status_id)
                        try:
                            in_reply_to_status_text = post2.text
                        except:
                            in_reply_to_status_text = post2.full_text
                        try:
                            in_reply_to_status_user_id = post.in_reply_to_screen_name
                        except:
                            in_reply_to_status_user_id = post2.user.name
                except Exception as e:
                    pass

                try:
                    quoted_status_id = post.quoted_status_id
                    if post_text[0:2] == "RT":
                        tweet = self.source_handler.get_specific_tweet(quoted_status_id)
                        try:
                            quoted_status_text = tweet.text
                        except:
                            quoted_status_text = tweet.full_text
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
                                      retweeted_status_text, retweeted_status_user_id, retweet_count, retweeted, likes)
                self.logger.send_message_to_logfile("- New post found and collected: " + str(post_id))


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

    def collect_and_save_connections(self, leader, current_time):
        """
        Search in every opinion leader's twitter account
        for followers from the rest of the opinion leaders in the DB
        """
        leader_twitter_id = np.long(leader['twitter_id'])
        self.logger.send_message_to_logfile("- Search for connection to another opinion leaders")
        followers_array = self.source_handler.get_following_list(leader_twitter_id)
        print(followers_array)
        try:
            if len(leader['community_following']) > 0:
                connection_arr = leader['community_following']
            else:
                connection_arr = []
        except:
            connection_arr = []
        new_connections_arr = []

        for follower in followers_array:
            if self.check_follower(follower, leader_twitter_id, connection_arr):
                twitter_screen_name = self.db.convertTwitterId_to_TwitterScreenName(self.collection, follower)
                if twitter_screen_name != None:
                    connection_arr.append({'twitter_screen_name': twitter_screen_name, "found_date":current_time})
                    new_connections_arr.append({'twitter_screen_name': twitter_screen_name, "found_date": str(current_time)})
                else:
                    self.logger.send_message_to_logfile("- Issue in convert twitter_id into twitter_screen_name. Ignore")
        self.logger.send_message_to_logfile("- Connections found:")
        self.logger.send_message_to_logfile(new_connections_arr)
        if len(connection_arr) > 0:
            self.db.insert_connections(self.collection, leader_twitter_id, connection_arr)
        return

    def check_follower(self, follower, leader_twitter_id, connection_arr):
        flag = False
        for leader in self.leaders:
            if follower == leader['twitter_id']:
                flag = True
                break
        if not flag:
            return False
        for item in connection_arr:
            try:
                if item['twitter_id'] == follower:
                    return False
            except:
                pass
        return True

    def update_opinion_leaders_information(self):
        for leader in self.leaders:
            details = self.source_handler.get_specific_profile(leader['twitter_id'])
            if details:
                print(leader['full_name'])
                profile_image = details.profile_image_url[0:details.profile_image_url.find(
                    '_normal')] + "_400x400" + details.profile_image_url[
                                               details.profile_image_url.rfind('.'):len(details.profile_image_url)]
                self.db.update_leader_details_regular(self.collection, leader['_id'], details.id,
                                                      details.screen_name,
                                                      details.location, details.description,
                                                      details.followers_count,
                                                      details.friends_count, details.created_at,
                                                      details.statuses_count,
                                                      False, leader['level_of_certainty'], profile_image)
            else:
                self.logger.send_message_to_logfile("Error! leader_info came back empty. exit(3)")
                exit(3)