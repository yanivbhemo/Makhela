import datetime
import csv
import os.path
from urllib import request
import json


class logger_handler:
    fileptr = ""
    slack_url=""

    def __init__(self):
        self.insert_slack_url()
        x = datetime.datetime.now()
        curr_date = str(str(x.year) + "-0" + str(x.month) + "-" + str(x.day) + "_" + str(x.hour) + "-" + str(x.minute))
        self.fileptr = open(os.path.dirname(__file__) + "/logs/" + curr_date, "a")

    def insert_slack_url(self):
        with open(".config", newline='') as config_file:
            config_list = csv.reader(config_file, delimiter=' ')
            for row in config_list:
                if row[0] == "slack_url":
                    self.slack_url = row[1]
        config_file.close()

    # Posting to a Slack channel
    def send_message_to_slack(self, text):
        post = {"text": "{0}".format(text)}
        try:
            json_data = json.dumps(post)
            req = request.Request(self.slack_url,
                                  data=json_data.encode('ascii'),
                                  headers={'Content-Type': 'application/json'})
            resp = request.urlopen(req)
        except Exception as em:
            print("EXCEPTION: " + str(em))

    def send_message_to_logAndSlack(self, text):
        self.send_message_to_slack(text)
        self.send_message_to_logfile(text)

    def send_message_to_logfile(self, text):
        self.fileptr.write(str(text)+"\n")
        print(text)

    def close_logfile(self):
        self.fileptr.close()
