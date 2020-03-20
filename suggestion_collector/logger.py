import os.path
import csv
from urllib import request
import json


# Posting to a Slack channel
def send_message_to_slack(text):
    slack_url = ""
    with open(".config", newline='') as config_file:
        config_list = csv.reader(config_file, delimiter=' ')
        for row in config_list:
            if row[0] == "slack_url":
                slack_url = row[1]
    config_file.close()
    post = {"text": "{0}".format(text)}
    print(text)
    try:
        json_data = json.dumps(post)
        req = request.Request(slack_url,
                              data=json_data.encode('ascii'),
                              headers={'Content-Type': 'application/json'})
        resp = request.urlopen(req)
    except Exception as em:
        print("EXCEPTION: " + str(em))
