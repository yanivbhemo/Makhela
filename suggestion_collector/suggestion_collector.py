import re

import numpy as np


class Suggestion_Collector:
    leaders_to_check = []
    logger = ""
    keywords = []

    def __init__(self, logger, source, db):
        self.logger = logger
        self.db = db
        self.source_handler = source
        keywords = self.db.get_collection("keywords", 0)
        for keyword in keywords:
            self.keywords.append(keyword['word'].lower())

    def collect(self):
        filter_query = {"checked_for_suggestions": False}
        posts = self.db.get_collection_with_filter("posts", filter_query, 1)
        post_arr = []

        """ First gather several posts and in case there are retweets, takes the source"""
        for post in posts:
            if post['in_reply_to_status_user_id'] != "None":
                leader_to_check = post['in_reply_to_status_user_id']
            elif post['quoted_status_user_id'] != "None":
                leader_to_check = post['quoted_status_user_id']
            elif post['retweeted_status_user_id'] != "None":
                leader_to_check = post['retweeted_status_user_id']
            if leader_to_check not in self.leaders_to_check:
                print("- Handles: " + leader_to_check)
                if not self.check_if_person_in_blacklist(leader_to_check):
                    if not self.check_if_person_in_community(leader_to_check):
                        self.check_level_of_certainty(leader_to_check)
                        self.leaders_to_check.append(leader_to_check)
                        post_arr.append(post['_id'])
                    else:
                        self.logger.send_message_to_logfile("- Person is already in the community. Ignore")
                else:
                    self.logger.send_message_to_logfile("- Person is in blacklist. Ignore")

        """ db.posts.updateMany({$or: [{"_id":ObjectId('5e6407e0124e74ea22f2a87f')},{"_id":ObjectId('5e6407e0124e74ea22f2a880')}]}, {$set: {"checked_for_suggestions": true}}) """
        self.db.bulk_update_suggestion_posts(post_arr)
        self.logger.send_message_to_logfile(self.leaders_to_check)

    def check_if_person_in_blacklist(self, twitter_id):
        query = {
            'leader_twitter_screen_name': twitter_id
        }
        result = self.db.get_collection_with_filter("blacklist", query, 1)
        if result.count() > 0:
            """ Leader is in blacklist"""
            return True
        else:
            return False

    def check_if_person_in_community(self, twitter_id):
        query = {
            'twitter_screen_name': twitter_id
        }
        result = self.db.get_collection_with_filter("opinion_leaders", query, 1)
        if result.count() > 0:
            """ Leader is in community"""
            return True
        else:
            return False

    def check_level_of_certainty(self, twitter_id):
        np_kw_array = np.array(self.keywords)
        proposed_id = twitter_id
        level_of_certainty = 0
        person_twitter_profile = self.source_handler.get_specific_user(twitter_id)
        print(self.keywords)
        """ First Check: If person's description has one of our keywords """
        proposed_description = person_twitter_profile.description.lower()
        proposed_description = re.sub(r"[^a-zA-Z0-9]+", ' ', proposed_description)
        np_description_array = np.array(proposed_description.split(' '))
        if len(np.intersect1d(np_kw_array, np_description_array)) > 0:
            level_of_certainty += 5
        exit(222)
        pass

    def add_certain_level_of_certainty_to_community(self, minimum_level):
        """ This function shifts leaders from suggestion collection
            With minimum level of certainty to the community
        """
        query_filter = {
            "level_of_certainty": {
                "$gte": minimum_level
            }
        }
        suggestions = self.db.get_collection_with_filter("suggestions", query_filter, 0)
        if suggestions.count() > 0:
            self.db.insertMany("opinion_leaders", suggestions)
            self.db.deleteMany("suggestions", suggestions)
