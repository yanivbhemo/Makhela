


class Suggestion_Collector:
    leaders_to_check = []
    logger = ""

    def __init__(self, logger, source, db):
        self.logger = logger
        self.db = db
        self.source_handler = source

    def collect(self):
        posts = self.db.get_collection("posts", 10)
        for post in posts:
            if post['in_reply_to_status_user_id'] != None:
                self.leaders_to_check.append(post['in_reply_to_status_user_id'])
            elif post['quoted_status_user_id'] != "None":
                self.leaders_to_check.append(post['quoted_status_user_id'])
            elif post['retweeted_status_user_id'] != "None":
                self.leaders_to_check.append(post['retweeted_status_user_id'])
        self.logger.send_message_to_logfile(self.leaders_to_check)

    def check_if_person_in_blacklist(self, twitter_id):
        pass

    def check_if_person_in_community(self, twitter_id):
        pass

    def check_level_of_certainty(self, twitter_id):
        pass

    def conver_twitter_screenname_to_id(self, screenname):
        pass