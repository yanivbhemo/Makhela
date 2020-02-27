import csv
from pymongo import MongoClient
from pprint import pprint
import numpy as np

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
            self.keywords.append(keyword['word'].lower())
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
            keywords_new.append(keyword['word'].lower())
        self.leaders = leaders_new
        self.keywords = keywords_new
        print("- Collector refreshed input data")
        print(self.leaders)

    def collect(self):
        for leader in self.db.opinion_leaders.find():
            print("\n- Handles: {0}".format(leader['full_name']))
            try:
                if(leader['new_leader']==False):
                    print("- Not a new leader, continue")
            except:
                self.collect_leader_init_details(leader['_id'], leader['full_name'])
        exit(-1)

    def collect_leader_init_details(self, leader_db_id, leader_fullName):
        leader_info = self.source_handler.search_twitter_name(leader_fullName)
        # Checks of more than 1 name came up
        print(len(leader_info))
        if (len(leader_info) == 1):
            for details in leader_info:
                leader_twitter_id = details.id
                leader_twitter_screen_name = details.screen_name
                leader_twitter_location = details.location
                leader_twitter_description = details.description
                leader_twitter_followers_count = details.followers_count
                leader_twitter_friends_count = details.friends_count
                leader_twitter_created_at = details.created_at
                leader_twitter_statuses_count = details.statuses_count
                new_leader = False
                query = {
                    '$set': {
                     'twitter_id': leader_twitter_id,
                     'twitter_screen_name': leader_twitter_screen_name,
                     'twitter_location': leader_twitter_location,
                     'twitter_description': leader_twitter_description,
                     'twitter_followers_count': leader_twitter_followers_count,
                     'twitter_friends_count': leader_twitter_friends_count,
                     'twitter_created_at': leader_twitter_created_at,
                     'twitter_statuses_count': leader_twitter_statuses_count,
                     'new_leader': new_leader,
                    }
                }
                self.db.opinion_leaders.update_one({'_id': leader_db_id}, query)
        else:
            print("- search for screen name came up with more than 1 result".format(
                leader_fullName))
            required_id = self.resolve_search_leader_multiple_results(leader_info)
            if(required_id == 0):
                print("- issue resolving the conflict. error 100")
                exit(100)
            for details in leader_info:
                if details.id == required_id:
                    leader_twitter_id = details.id
                    leader_twitter_screen_name = details.screen_name
                    leader_twitter_location = details.location
                    leader_twitter_description = details.description
                    leader_twitter_followers_count = details.followers_count
                    leader_twitter_friends_count = details.friends_count
                    leader_twitter_created_at = details.created_at
                    leader_twitter_statuses_count = details.statuses_count
                    new_leader = False
                    query = {
                        '$set': {
                         'twitter_id': leader_twitter_id,
                         'twitter_screen_name': leader_twitter_screen_name,
                         'twitter_location': leader_twitter_location,
                         'twitter_description': leader_twitter_description,
                         'twitter_followers_count': leader_twitter_followers_count,
                         'twitter_friends_count': leader_twitter_friends_count,
                         'twitter_created_at': leader_twitter_created_at,
                         'twitter_statuses_count': leader_twitter_statuses_count,
                         'new_leader': new_leader,
                        }
                    }
                    self.db.opinion_leaders.update_one({'_id': leader_db_id}, query)

    def resolve_search_leader_multiple_results(self, leaders_info):
        np_kw_array = np.array(self.keywords)
        proposed_id=0
        for leader in leaders_info:
            proposed_id = leader.id
            proposed_description = leader.description.lower()
            np_description_array = np.array(proposed_description.split(' '))
            if(len(np.intersect1d(np_kw_array, np_description_array)) > 0):
                break
        return proposed_id