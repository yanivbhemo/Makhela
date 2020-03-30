import os
import re
import numpy as np


class Suggestion_Collector:
    leaders_to_check = []
    current_suggested_leaders = []
    logger = ""
    keywords = []

    def __init__(self, logger, source, db):
        self.logger = logger
        self.db = db
        self.source_handler = source
        keywords = self.db.get_collection("keywords", 0)
        for keyword in keywords:
            self.keywords.append(keyword['word'].lower())
        current_suggested_leaders = self.db.get_collection("suggestions", 0)
        for leader in current_suggested_leaders:
            self.current_suggested_leaders.append(leader)

    def collect(self):
        filter_query = {"checked_for_suggestions": False}
        # stop_flag
        posts = self.db.get_collection_with_filter("posts", filter_query, 220)
        post_arr = []
        names_arr = []
        self.leaders_to_check = []
        leader_to_check=None

        """ First gather several posts and in case there are retweets, takes the source"""
        for post in posts:
            if post['in_reply_to_status_user_id'] != "None":
                leader_to_check = post['in_reply_to_status_user_id']
            elif post['quoted_status_user_id'] != "None":
                leader_to_check = post['quoted_status_user_id']
            elif post['retweeted_status_user_id'] != "None":
                leader_to_check = post['retweeted_status_user_id']
            if leader_to_check != None:
                if leader_to_check not in names_arr:
                    print("- Handles: " + leader_to_check)
                    if not self.check_if_person_in_blacklist(leader_to_check):
                        if not self.check_if_person_in_community(leader_to_check):
                            level_of_certainty = self.check_level_of_certainty(leader_to_check)
                            if level_of_certainty > 0:
                                self.leaders_to_check.append({"screen_name": leader_to_check, "level_of_certainty": level_of_certainty})
                                names_arr.append(leader_to_check)
                            else:
                                self.logger.send_message_to_logfile("- Level of certainty = 0. Ignore")
                        else:
                            self.logger.send_message_to_logfile("- Person is already in the community. Ignore")
                    else:
                        self.logger.send_message_to_logfile("- Person is in blacklist. Ignore")
            post_arr.append(post['_id'])
        print(self.leaders_to_check)

        if len(post_arr) > 0:
            self.collect_suggested_leader_init_details()
            self.db.bulk_update_suggestion_posts(post_arr)
        else:
            self.logger.send_message_to_logAndSlack("- Suggestion Collector couldn't find any new suggestions")

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
        result2 = self.db.get_collection_with_filter("suggestions", query, 1)
        if result.count() > 0 or result2.count() > 0:
            """ Leader is in community """
            return True
        else:
            return False

    def check_level_of_certainty(self, twitter_id):
        np_kw_array = np.array(self.keywords)
        proposed_id = twitter_id
        level_of_certainty = 0
        person_twitter_profile = self.source_handler.get_specific_user(twitter_id)
        if person_twitter_profile != None:
            # First check: If leader description contains one or more internal keywords
            # If it is it receives 'AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY' points
            # Second check: If leader's name is the same as written in the DB
            # If it is it receives 'AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY' points
            try:
                proposed_description = person_twitter_profile.description.lower()
                proposed_description = re.sub(r"[^a-zA-Z0-9]+", ' ', proposed_description)
                np_description_array = np.array(proposed_description.split(' '))
                if len(np.intersect1d(np_kw_array, np_description_array)) > 0:
                    level_of_certainty += int(os.getenv('AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY'))
            except:
                pass

            # Third check: The person with the highest value of followers
            # Will receive 'AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY' points
            if int(os.getenv('MIN_AMOUNT_OF_FOLLOWERS')) < person_twitter_profile.followers_count < int(os.getenv('MID_AMOUNT_OF_FOLLOWERS')):
                level_of_certainty += 1
            elif int(os.getenv('MAX_AMOUNT_OF_FOLLOWERS')) > person_twitter_profile.followers_count > int(os.getenv('MID_AMOUNT_OF_FOLLOWERS')):
                level_of_certainty += 2
            elif person_twitter_profile.followers_count > int(os.getenv('MAX_AMOUNT_OF_FOLLOWERS')):
                level_of_certainty += 3

            # Forth check: Amount of posts
            if person_twitter_profile.statuses_count > int(os.getenv('MIN_AMOUNT_OF_STATUSES')):
                level_of_certainty += 1

        return level_of_certainty

    def add_certain_level_of_certainty_to_community(self, minimum_level):
        """ This function shifts leaders from suggestion collection
            With minimum level of certainty to the community
        """
        query_filter = {
            "level_of_certainty": {
                "$gte": minimum_level
            }
        }
        suggestions = self.db.get_collection_with_filter("suggestions", query_filter, 0)
        if suggestions.count() > 0:
            self.db.insertMany("opinion_leaders", suggestions)
            self.db.deleteMany("suggestions", suggestions)

    def collect_suggested_leader_init_details(self):
        if len(self.leaders_to_check) > 0:
            for i in range(len(self.leaders_to_check)):
                details = self.source_handler.get_specific_user(self.leaders_to_check[i]['screen_name'])
                if details != None:
                    fullname=details.name
                    profile_image = details.profile_image_url[0:details.profile_image_url.find(
                            '_normal')] + "_400x400" + details.profile_image_url[
                                                       details.profile_image_url.rfind('.'):len(
                                                           details.profile_image_url)]
                    if self.leaders_to_check[i]['level_of_certainty'] < int(os.getenv('AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY')):
                        self.db.insert_leader_details_regular("suggestions", details.id, details.screen_name, fullname, details.location, details.description,details.followers_count, details.friends_count, details.created_at, details.statuses_count, False, self.leaders_to_check[i]['level_of_certainty'], profile_image)
                        self.logger.send_message_to_logfile("\t+ '" + details.screen_name + "' Inserted into 'suggestions' collection")
                    else:
                        self.db.insert_leader_details_regular("opinion_leaders", details.id, details.screen_name,
                                                                  fullname, details.location, details.description,
                                                                  details.followers_count, details.friends_count,
                                                                  details.created_at, details.statuses_count, False,
                                                                  self.leaders_to_check[i]['level_of_certainty'],
                                                                  profile_image)
                        self.logger.send_message_to_logfile("\t+ '" + details.screen_name + "' Inserted into 'opinion_leaders' collection")
                else:
                    self.logger.send_message_to_logAndSlack("- Couldn't find the following in twitter: " + self.leaders_to_check[i]['screen_name'])
        else:
            self.logger.send_message_to_logAndSlack("- self.leaders_to_check Variable is empty!")