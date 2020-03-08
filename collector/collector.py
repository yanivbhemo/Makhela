import numpy as np
import re
import requests
from bs4 import BeautifulSoup


class Collector:
    leaders = []
    keywords = []
    db = ""
    source_handler = ""

    def __init__(self, source, db):
        self.db = db
        leaders = self.db.get_collection("opinion_leaders")
        for leader in leaders:
            self.leaders.append(leader)
        keywords = self.db.get_collection("keywords")
        for keyword in keywords:
            self.keywords.append(keyword['word'].lower())
        self.source_handler = source
        print("- Collector created")

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
        print("- Collector refreshed input data")

    def collect(self):
        print("- Start collecting")
        for leader in self.leaders:
            print("\n- Handles: {0}".format(leader['full_name']))
            if leader['new_leader'] == False:
                print("- Not a new leader")
                if leader['level_of_certainty'] > 0:
                    print("- Continue to collect only posts/tweets")
                    self.collect_and_save_tweetsV2(leader['_id'], leader['twitter_id'])
                else:
                    print("- Low level of certainty. Continue to next leader")
            else:
                print("- New leader. Collecting init details")
                self.collect_leader_init_details(leader['_id'], leader['full_name'])

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
            print("- Collector did not find any person with that name")
            self.db.update_leader_details_empty("opinion_leaders", leader_db_id)
        elif len(leader_info) > 1:
            print("- Search for screen name came up with more than 1 result".format(
                leader_fullName))
            required_id = self.resolve_search_leader_multiple_results(leader_info, leader_fullName)
            if required_id['id'] == 0:
                print("- Issue found while resolving the conflict. error 100")
                self.db.update_leader_details_empty("opinion_leaders", leader_db_id)
            else:
                for details in leader_info:
                    if details.id == required_id["id"]:
                        profile_image = details.profile_image_url[0:details.profile_image_url.find(
                            '_normal')] + "_400x400" + details.profile_image_url[
                                                       details.profile_image_url.find('.jpeg'):len(
                                                           details.profile_image_url)]
                        self.db.update_leader_details_regular("opinion_leaders", leader_db_id, details.id,
                                                              details.screen_name,
                                                              details.location, details.description,
                                                              details.followers_count,
                                                              details.friends_count, details.created_at,
                                                              details.statuses_count,
                                                              False, required_id["level_of_certainty"], profile_image)

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

    def collect_and_save_tweets(self, leader_db_id, leader_twitter_id):
        result = self.source_handler.get_tweets(leader_twitter_id)

        for post in result:
            post_date = post.created_at
            post_id = post.id
            print(post)
            print(post.full_text)
            if not self.check_if_post_exists_in_db(leader_db_id, post_id):
                post_text = post.full_text
                if post_text[0] + post_text[1] == "RT":
                    """ Handles retweets with RT in the beginning """
                    post_text = post_text[0:post_text.find(':') + 2]
                    post_text += post.retweeted_status.full_text
                    self.db.insert_post("posts", leader_twitter_id, post_date, post_id, post_text, post.retweet_count,
                                        post.retweeted_status.favorite_count)
                else:
                    try:
                        quoted_status_id = post.quoted_status_id
                        print(quoted_status_id)
                    except:
                        """ If not quoted """
                        print("test")
                """ Handles regular tweet """
                self.db.insert_post("posts", leader_twitter_id, post_date, post_id, post_text, post.retweet_count,
                                    post.favorite_count)

            else:
                print("- Post " + str(post_id) + " already exist. ignore")
        exit(2)

    def collect_and_save_tweetsV2(self, leader_db_id, leader_twitter_id):
        print("- Collecting posts")
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
                    in_reply_to_status_text = self.source_handler.get_specific_tweet(in_reply_to_status_id).text
                    in_reply_to_status_user_id = post.in_reply_to_screen_name
                except Exception as e:
                    pass

                try:
                    quoted_status_id = post.quoted_status_id
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
                self.db.insert_postV2("posts", leader_twitter_id, post_id, post_text, date_created, in_reply_to_status_id, in_reply_to_status_text, in_reply_to_status_user_id, quoted_status_id, quoted_status_text, quoted_status_user_id, retweeted_status_id, retweeted_status_text, retweeted_status_user_id)
                print("- New post found and collected")

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
            print(item.get_text())
