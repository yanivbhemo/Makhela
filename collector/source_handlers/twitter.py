import csv
import time
import tweepy
import os
import requests
from bs4 import BeautifulSoup


class Twitter_handler:
    consumer_key = ""
    consumer_secret = ""
    access_token = ""
    access_token_secret = ""
    api = ""
    logger = ""

    def __init__(self, logger):
        self.logger = logger
        self.insert_creds()
        self.auth_with_twitter()
        self.logger.send_message_to_logfile("- Twitter handler created")

    def insert_creds(self):
        self.consumer_key = os.getenv('consumer_key')
        self.consumer_secret = os.getenv('consumer_secret')
        self.access_token = os.getenv('access_token')
        self.access_token_secret = os.getenv('access_token_secret')

    def auth_with_twitter(self):
        auth = tweepy.OAuthHandler(self.consumer_key, self.consumer_secret)
        auth.set_access_token(self.access_token, self.access_token_secret)
        try:
            self.api = tweepy.API(auth)
        except Exception as e:
            self.logger.send_message_to_logAndSlack(e)

    def search_twitter_name(self, name):
        try:
            result = self.api.search_users(q=name, page=1)
            result2 = self.api.search_users(q=name, page=2)
            if(result != result2):
                result+=result2
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
        except Exception as e:
            self.logger.send_message_to_logAndSlack(e)
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
            try:
                return self.api.search_users(q=list[len(list) - 1])
            except Exception as e:
                self.logger.send_message_to_logAndSlack(e)

    def get_tweets(self, user_id):
        result = ""
        try:
            result = self.api.user_timeline(id=user_id, tweet_mode="extended")
        except Exception as e:
            self.logger.send_message_to_logAndSlack("- Error in function: 'get_tweets'")
            self.logger.send_message_to_logAndSlack("- user_id = " + str(user_id))
            self.logger.send_message_to_logAndSlack(e)
        return result

    def get_specific_tweet(self, status_id):
        try:
            result = self.api.get_status(id=status_id, tweet_mode="extended")
            return result
        except Exception as e:
            self.logger.send_message_to_logAndSlack("- Error in function: 'get_specific_tweet'")
            self.logger.send_message_to_logAndSlack("- status_id = " + str(status_id))
            self.logger.send_message_to_logAndSlack(e)

    def get_specific_profile(self, twitter_id):
        try:
            result = self.api.get_user(id=twitter_id)
            return result
        except Exception as e:
            self.logger.send_message_to_logAndSlack("- Error in function: 'get_specific_profile'")
            self.logger.send_message_to_logAndSlack("- twitter_id = " + str(twitter_id))
            self.logger.send_message_to_logAndSlack(e)
            return False
    def get_following_list(self, status_id):
        flag = False
        result = ""
        while not flag:
            try:
                result = self.api.friends_ids(id=status_id)
                flag = True
            except Exception as e:
                self.logger.send_message_to_logAndSlack("- Rate limit. sleep for 15 minutes")
                self.logger.send_message_to_logAndSlack("- Twitter Error: \n" + str(e))
                time.sleep(60)
        return result