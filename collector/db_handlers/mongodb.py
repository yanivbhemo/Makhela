import csv
from pymongo import MongoClient
import os.path


class DataBaseHandler:
    db_username = ""
    db_password = ""
    db = ""
    logger = ""

    def __init__(self, logger):
        self.logger = logger
        if not self.insert_creds():
            self.logger.send_message_to_logfile("- Error with db creds. Exit. (error 102)")
            exit(102)
        try:
            client = MongoClient(
                "mongodb+srv://" + self.db_username + ":" + self.db_password + "@makhela-qvsh8.mongodb.net/Makhela?retryWrites=true&w=majority")
            self.db = client.Makhela
            self.logger.send_message_to_logfile("- DB Handler created")
        except Exception as e:
            self.logger.send_message_to_logfile("- Error: can't connect to the DB (error 101)")
            self.logger.send_message_to_logfile(e)
            self.db = False
            exit(101)

    def insert_creds(self):
        # get user creds from config file
        with open(os.path.dirname(__file__) + "/../.config", newline='') as config_file:
            config_list = csv.reader(config_file, delimiter=':')
            for row in config_list:
                if (row[0] == "db_user"):
                    self.db_username = row[1]
                    self.db_password = row[2]
                    config_file.close()
                    return True
        config_file.close()
        return False

    def get_collection(self, collection):
        col = self.db[collection]
        return col.find()

    def get_collection_with_filter(self, collection, filter):
        col = self.db[collection]
        return col.find(filter)

    def update_leader_details_regular(self, collection, id_to_update, leader_twitter_id, leader_twitter_screen_name,
                              leader_twitter_location, leader_twitter_description, leader_twitter_followers_count,
                              leader_twitter_friends_count, leader_twitter_created_at, leader_twitter_statuses_count,
                              new_leader, level_of_certainty, leader_twitter_profile_image_url):
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
                'level_of_certainty': level_of_certainty,
                'twitter_profile_image': leader_twitter_profile_image_url,
                'lock': False
            }
        }
        col = self.db[collection]
        col.update_one({'_id': id_to_update}, query)

    def update_leader_details_empty(self, collection, id_to_update):
        col = self.db[collection]
        query = {
            '$set': {
                'level_of_certainty': 0,
                'new_leader': False,
                'lock': False
            }
        }
        col.update_one({'_id': id_to_update}, query)

    def insert_post(self, collection, leader_twitter_id, post_date, post_id, post_text, retweet_count, likes):
        query = {
            "profile_id": leader_twitter_id,
            "date": post_date,
            "post_id": post_id,
            "text": post_text,
            "retweet_count": retweet_count,
            "likes": likes
        }
        col = self.db[collection]
        col.insert_one(query)

    def insert_postV2(self, collection, leader_twitter_id, post_id, full_text, date_created, in_reply_to_status_id, in_reply_to_status_text, in_reply_to_status_user_id, quoted_status_id, quoted_status_text, quoted_status_user_id, retweeted_status_id, retweeted_status_text, retweeted_status_user_id):
        query = {
            "leader_twitter_id": leader_twitter_id,
            "post_id": post_id,
            "full_text": full_text,
            "date_created": date_created,
            "in_reply_to_status_id": in_reply_to_status_id,
            "in_reply_to_status_text": in_reply_to_status_text,
            "in_reply_to_status_user_id": in_reply_to_status_user_id,
            "quoted_status_id": quoted_status_id,
            "quoted_status_text": quoted_status_text,
            "quoted_status_user_id": quoted_status_user_id,
            "retweeted_status_id": retweeted_status_id,
            "retweeted_status_text": retweeted_status_text,
            "retweeted_status_user_id": retweeted_status_user_id
        }
        col = self.db[collection]
        col.insert_one(query)

    def insert_connections(self, collection, leader_twitter_id, connection_arr):
        col = self.db[collection]
        query = {
            '$set': {
                'community_following': connection_arr
            }
        }
        col.update_one({'twitter_id': leader_twitter_id}, query)

    def lock_opinion_leader(self, leader_db_id):
        query = {
            '$set': {
                'lock': True
            }
        }
        self.db['opinion_leaders'].update_one({'_id': leader_db_id}, query)

    def unlock_opinion_leader(self, leader_db_id):
        query = {
            '$set': {
                'lock': False
            }
        }
        self.db['opinion_leaders'].update_one({'_id': leader_db_id}, query)

    def unlock_all_opinion_leaders(self):
        self.db['opinion_leaders'].update_many({}, {'$set': {'lock': False}})