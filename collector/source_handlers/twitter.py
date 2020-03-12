import csv
import time
import tweepy
import os.path
from pprint import pprint
import requests
from bs4 import BeautifulSoup
import logger


class Twitter_handler:
    consumer_key = ""
    consumer_secret = ""
    access_token = ""
    access_token_secret = ""
    api = ""

    def __init__(self):
        self.insert_creds()
        self.auth_with_twitter()
        print("- Twitter handler created")

    def insert_creds(self):
        with open(os.path.dirname(__file__) + "/../.config.txt", newline='') as config_file:
            config_list = csv.reader(config_file, delimiter=':')
            for row in config_list:
                if row[0] == "twitter":
                    if row[1] == "consumer_key":
                        self.consumer_key = row[2]
                    if row[1] == "consumer_secret":
                        self.consumer_secret = row[2]
                    if row[1] == "access_token":
                        self.access_token = row[2]
                    if row[1] == "access_token_secret":
                        self.access_token_secret = row[2]

    def auth_with_twitter(self):
        auth = tweepy.OAuthHandler(self.consumer_key, self.consumer_secret)
        auth.set_access_token(self.access_token, self.access_token_secret)
        self.api = tweepy.API(auth)

    def search_twitter_name(self, name):
        try:
            filtered_name = name.split(' ')[0] + " " + name.split(' ')[len(name.split(' ')) - 1]
            result = self.api.search_users(q=filtered_name)
            if len(result) == 0:
                url = "https://twitter.com/search?q=" + name.split(' ')[0] + "%20" + name.split(' ')[
                    len(name.split(' ')) - 1] + "&src=typed_query&f=user"
                if self.compare_with_scrap(url, "Sorry, we didn’t find any results."):
                    return []
                else:
                    result = self.find_with_scrap(self, url)
                    return result
            else:
                return result
        except tweepy.TweepError as e:
            pprint(e)
            return []

    # This method is used to check if there is absolutly no results when try to find someone using web scraping methods
    @staticmethod
    def compare_with_scrap(url, text_to_find):
        page = requests.get(url)
        soup = BeautifulSoup(page.text, "html.parser")
        divs = soup.find_all('div')
        for div in divs:
            text_to_check = div.get_text()
            text_to_check = text_to_check.strip()
            if text_to_check == text_to_find:
                return True
        return False

    @staticmethod
    def find_with_scrap(self, url):
        """
        This method used in case "compare_with_scrap" did found something
        It gets a url to scrap from and returns user data
        """
        page = requests.get(url)
        soup = BeautifulSoup(page.text, 'html.parser')

        for item in soup.find_all('div', class_='ProfileCard-actions'):
            list = str(item.get_text()).replace('\n', '').split(' ')
            return self.api.search_users(q=list[len(list) - 1])

    def get_tweets(self, user_id):
        result = self.api.user_timeline(id=user_id, tweet_mode="extended")
        return result

    def get_specific_tweet(self, status_id):
        return self.api.get_status(id=status_id)

    def get_following_list(self, status_id):
        try:
            result = self.api.friends_ids(id=status_id)
            return result
        except tweepy.RateLimitError as e:
            logger.send_message_to_slack("- Rate limit. sleep for 15 minutes")
            logger.send_message_to_slack("- Twitter Error: \n" + str(e))
            time.sleep(15 * 60)
            return self.get_following_list(status_id)