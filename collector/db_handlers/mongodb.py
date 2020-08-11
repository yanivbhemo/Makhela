import urllib as urllib
from pymongo import MongoClient
import os
import datetime

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
            "mongodb://" + self.db_username + ":" + urllib.parse.quote(self.db_password) + "@db.dev.makhela.live/" + os.getenv(
                'db_name') + "?ssl_cert_reqs=CERT_NONE")
            self.db = client[os.getenv('db_name')]
            self.logger.send_message_to_logfile("- DB Handler created")
        except Exception as e:
            self.logger.send_message_to_logfile("- Error: can't connect to the DB (error 101)")
            self.logger.send_message_to_logfile(e)
            self.db = False
            exit(101)

    def insert_creds(self):
        self.db_username = os.getenv('db_username')
        self.db_password = os.getenv('db_password')
        return True

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
                'lock': False,
            }
        }
        col = self.db[collection]
        col.update_one({'_id': id_to_update}, query)

    def insert_leader_details_regular(self, collection, leader_twitter_id, leader_twitter_screen_name,leader_fullname,
                              leader_twitter_location, leader_twitter_description, leader_twitter_followers_count,
                              leader_twitter_friends_count, leader_twitter_created_at, leader_twitter_statuses_count,
                              new_leader, level_of_certainty, leader_twitter_profile_image_url):
        query = {
                'twitter_id': leader_twitter_id,
                'full_name': leader_fullname,
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
                'lock': False,
                'internal_create_date': datetime.datetime.now()
        }
        col = self.db[collection]
        col.insert_one(query)

    def update_leader_details_empty(self, collection, id_to_update):
        col = self.db[collection]
        query = {
            '$set': {
                'level_of_certainty': 0,
                'new_leader': False,
                'lock': False,
                'internal_create_date': datetime.datetime.now()
            }
        }
        col.update_one({'_id': id_to_update}, query)

    def insert_leader_details_empty(self, collection, fullname):
        col = self.db[collection]
        query = {
                'full_name': fullname,
                'level_of_certainty': 0,
                'lock': False,
                'internal_create_date': datetime.datetime.now()
        }
        col.insert_one(query)
    def insert_post(self, collection, leader_twitter_id, post_date, post_id, post_text, retweet_count, likes):
        query = {
            "profile_id": leader_twitter_id,
            "date": post_date,
            "post_id": post_id,
            "text": post_text,
            "retweet_count": retweet_count,
            "likes": likes,
            "internal_create_date": datetime.datetime.now()
        }
        col = self.db[collection]
        col.insert_one(query)

    def insert_postV2(self, collection, leader_twitter_id, post_id, full_text, date_created, in_reply_to_status_id, in_reply_to_status_text, in_reply_to_status_user_id, quoted_status_id, quoted_status_text, quoted_status_user_id, retweeted_status_id, retweeted_status_text, retweeted_status_user_id, retweet_count, retweeted, likes):
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
            "retweeted_status_user_id": retweeted_status_user_id,
            "checked_for_suggestions": False,
            "internal_create_date": datetime.datetime.now(),
            "retweet_count": retweet_count,
            "retweeted": retweeted,
            "likes": likes
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

    def delete_ununique_documents(self):
        leaders = []
        count = 0
        result = self.get_collection("opinion_leaders")
        result2 = self.get_collection("opinion_leaders")
        for leader_to_check in result:
            result2 = self.db['opinion_leaders'].find({'_id': {'$ne': leader_to_check['_id']}})
            for leader in result2:
                if leader_to_check['full_name'] == leader['full_name']:
                    #print(leader_to_check)
                    #print(leader)
                    if self.db['opinion_leaders'].find({'full_name':leader_to_check['full_name']}).count() > 1:
                        #print("Delete: " + str(leader['_id']))
                        #self.db['sugguestions'].delete_one({'_id': leader['_id']})
                        print("db.opinion_leaders.deleteOne({'_id': ObjectId('" + str(leader['_id']) + "')})")

    def get_system_settings(self, attribute):
        result = self.db['settings'].find({'attribute':attribute})
        if result.count() > 0:
            return result[0]['value']
        else:
            print("- Error in mongodb.py -> def get_system_settings(self, attribute)")
            print("exit 446")
            exit(446)

    def init_documents_with_ids(self, collection):
        # Give each document in the collection an internal native id
        result = self.db[collection].find({})
        id = 0
        for doc in result:
            self.db[collection].update_one({"_id":doc['_id']}, {'$set': {"native_id": id}})
            id += 1

    def move_leader_from_community_to_suggestions(self, collection, id_to_update, leader_twitter_id, leader_twitter_screen_name,
                              leader_twitter_location, leader_twitter_description, leader_twitter_followers_count,
                              leader_twitter_friends_count, leader_twitter_created_at, leader_twitter_statuses_count,
                              new_leader, level_of_certainty, leader_twitter_profile_image_url, leader_fullName, internal_create_date):
        # This function move leaders from community to the suggestions collection based on their level of certainty
        query = {
                'full_name': leader_fullName,
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
                'lock': False,
                'internal_create_date': internal_create_date
        }
        col = self.db["suggestions"]
        col.insert_one(query)
        col = self.db[collection]
        col.delete_one({'_id': id_to_update})

    def move_leader_from_community_to_blacklist(self, collection, id_to_update):
        # This function move leaders from community to the blacklist collection based on their level of certainty
        col = self.db[collection]
        doc = col.find_one({"_id": id_to_update})
        col = self.db["blacklist"]
        col.insert_one(doc)
        col = self.db[collection]
        col.delete_one({'_id': id_to_update})

    def convertTwitterId_to_TwitterScreenName(self, collection, twitter_id):
        col = self.db[collection]
        doc = col.find_one({"twitter_id": twitter_id})
        if len(doc) > 0:
            return doc['twitter_screen_name']
        else:
            return None
