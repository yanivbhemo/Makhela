from pymongo import MongoClient
import logger
import datetime

class Community:

    def __init__(self, user, password):
        self.user = user
        self.password = password
        self.db = ""
        self.leaders = []
        self.posts = []
        self.key_words = []
        self.connect_db()

    def connect_db(self):
        log = logger.logger_handler()
        try:
            log.send_message_to_logfile("connecting")
            db = MongoClient(
                "mongodb+srv://" + self.user + ":" + self.password + "@makhela-qvsh8.mongodb.net/Makhela?ssl=true&ssl_cert_reqs=CERT_NONE")
            self.db = db.Makhela
        except:
            log.send_message_to_logfile("failed to connect")

    def fetch_opinion_leaders(self, log):
        log.send_message_to_logfile("fetching opinion leaders")
        res_leaders = self.db["opinion_leaders"].find()
        leaders = {}
        for leader in res_leaders:
            try:
                leaders[leader["twitter_id"]] = leader
                leader["posts"] = []
            except:
                log.send_message_to_logfile("failed to fetch: ", leader["twitter_id"])
                continue
        self.leaders = leaders

    def fetch_posts(self, log):
        log.send_message_to_logfile("fetching posts")
        posts = {}
        i = 0
        for key, value in self.leaders.items():
            i += 1
            res_posts = self.db["posts"].find({"leader_twitter_id": key})
            for post in res_posts:
                try:
                    posts[post["post_id"]] = post
                    # self.leaders[value['leader_twitter_id']]["posts"].append(key)
                except:
                    log.send_message_to_logfile("exception ", key)
                    continue
        self.posts = posts


    def fetch_key_words(self, log):
        log.send_message_to_logfile("fatching keywords")
        try:
            keywords = self.db.keywords.find()
            try:
                for word in keywords:
                    self.key_words.append(word["word"])
                return self.key_words
            except:
                log.send_message_to_logfile("exception: ", word)
        except:
            log.send_message_to_logfile("failed to fetch keywords")

    def get_community(self):
        log = logger.logger_handler()
        self.fetch_opinion_leaders(log)
        self.fetch_posts(log)
        self.fetch_key_words(log)
        return self.leaders, self.posts, self.key_words


    def save(self, leaders, posts):
        log = logger.logger_handler()
        log.send_message_to_logfile("saving to db")
        today = datetime.datetime.today()
        for key, value in leaders.items():
            try:
                leaders[key]["analyzed_date"] = today
                self.db["opinion_leaders"].replace_one({'twitter_id': key}, leaders[key])
            except:
                log.send_message_to_logfile("exception saving to db - opinion leaders: ", key)
                continue
        for key, value in posts.items():
            try:
                posts[key]["analyzed_date"] = today
                self.db["posts"].replace_one({'post_id': key}, posts[key])
            except:
                log.send_message_to_logfile("exception saving to db - posts: ", key)
                continue

