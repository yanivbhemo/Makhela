import csv
from pymongo import MongoClient
from pprint import pprint


class Collector:
    leaders = []
    keywords = []
    db = ""
    source_handler = ""

    def __init__(self, source):
        self.db = self.connect_collector_to_db()
        for leader in self.db.opinion_leaders.find():
            self.leaders.append(leader['full_name'])
        for keyword in self.db.keywords.find():
            self.keywords.append(keyword['word'])
        self.source_handler = source
        print("- Collector created")
        print("- Start collecting")
        self.collect()

    @staticmethod
    def connect_collector_to_db():
        # get user creds from config file
        with open(".config.txt", newline='') as config_file:
            config_list = csv.reader(config_file, delimiter=':')
            for row in config_list:
                if (row[0] == "db_user"):
                    db_username = row[1]
                    db_password = row[2]
                    break
        client = MongoClient(
            "mongodb+srv://" + db_username + ":" + db_password + "@makhela-qvsh8.mongodb.net/Makhela?retryWrites=true&w=majority")
        return client.Makhela

    def refresh_collector_input(self):
        leaders_new = []
        keywords_new = []
        for leader in self.db.opinion_leaders.find():
            leaders_new.append(leader['full_name'])
        for keyword in self.db.keywords.find():
            keywords_new.append(keyword['word'])
        self.leaders = leaders_new
        self.keywords = keywords_new
        print("- Collector refreshed input data")
        print(self.leaders)

    def collect(self):
        for leader in self.db.opinion_leaders.find():
            print("\n- Handles: {0}".format(leader['full_name']))
            try:
                if(leader['new_leader']):
                    print("- Not new leader, continue")
            except:
                self.collect_leader_init_details(leader['_id'], leader['full_name'])
        exit(-1)

    def collect_leader_init_details(self, leader_db_id, leader_fullName):
        leader_info = self.source_handler.search_twitter_name(leader_fullName)
        if leader_info:
            for details in leader_info:
                leader_twitter_id = details.id
                leader_twitter_screen_name = details.screen_name
                print(type(leader_twitter_screen_name))
                leader_twitter_location = details.location
                leader_twitter_description = details.description
                leader_twitter_followers_count = details.followers_count
                leader_twitter_friends_count = details.friends_count
                leader_twitter_created_at = details.created_at
                leader_twitter_statuses_count = details.statuses_count
                leader_twitter_new_leader = False
                query = {'_id': leader_db_id,
                     'leader_twitter_id': leader_twitter_id,
                     'screen_name': leader_twitter_screen_name,
                     'twitter_location': leader_twitter_location,
                     'twitter_description': leader_twitter_description,
                     'twitter_followers_count': leader_twitter_followers_count,
                     'twitter_friends_count': leader_twitter_friends_count,
                     'twitter_created_at': leader_twitter_created_at,
                     'twitter_statuses_count': leader_twitter_statuses_count,
                     'twitter_new_leader': leader_twitter_new_leader,
                     }
                self.db.opinion_leaders.insert_one(query)
        else:
            print("- search for screen name came up with more than 1 result (Exit code: 100)".format(
                leader_fullName))
            exit(100)