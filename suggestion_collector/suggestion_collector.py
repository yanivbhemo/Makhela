import json


class Suggestion_Collector:
    leaders_to_check = []
    logger = ""

    def __init__(self, logger, source, db):
        self.logger = logger
        self.db = db
        self.source_handler = source

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
        pass