from urllib import request, parse
import json

# Posting to a Slack channel
def send_message_to_slack(text):

    post = {"text": "{0}".format(text)}
    print(text)
    try:
        json_data = json.dumps(post)
        req = request.Request("https://hooks.slack.com/services/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",
                              data=json_data.encode('ascii'),
                              headers={'Content-Type': 'application/json'})
        resp = request.urlopen(req)
    except Exception as em:
        print("EXCEPTION: " + str(em))