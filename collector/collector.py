import csv
from pymongo import MongoClient


class Collector:
    info_source = "Twitter"
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
