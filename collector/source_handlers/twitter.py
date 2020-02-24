import csv
import tweepy
import os.path


class Twitter_handler:
    consumer_key = ""
    consumer_secret = ""
    access_token = ""
    access_token_secret = ""

    def __init__(self):
        self.insert_creds()
        self.auth_with_twitter()
        print("- Twitter handler created")

    def insert_creds(self):
        with open(os.path.dirname(__file__) + "/../.config.txt", newline='') as config_file:
            config_list = csv.reader(config_file, delimiter=':')
            for row in config_list:
                if (row[0] == "twitter"):
                    if (row[1] == "consumer_key"):
                        self.consumer_key = row[2]
                    if (row[1] == "consumer_secret"):
                        self.consumer_secret = row[2]
                    if (row[1] == "access_token"):
                        self.access_token = row[2]
                    if (row[1] == "access_token_secret"):
                        self.access_token_secret = row[2]

    def auth_with_twitter(self):
        auth = tweepy.OAuthHandler(self.consumer_key, self.consumer_secret)
        auth.set_access_token(self.access_token, self.access_token_secret)
