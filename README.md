# Makhela
Makhela is a semi-autonomous intelligence system for gather community opinions from varies information sources  

## Run the collection engines using docker and crontab
```docker
0 */1 * * *     /usr/bin/docker run --rm --name tweets-collection -e consumer_key=XXX -e consumer_secret=XXX -e access_token=XXX -e access_token_secret=XXX -e db_username=XXX -e db_password=XXX -e slack_url=XXX -e RUN_TYPE=tweets -e COLLECTION=opinion_leaders makhela/collector_2.0.32 > /root/logs/tweets-collection
```
```docker
0 */3 * * *     /usr/bin/docker run --rm --name connections-collection -e consumer_key=XXX -e consumer_secret=XXX -e access_token=XXX -e access_token_secret=XXX -e db_username=XXX -e db_password=XXX -e slack_url=XXX -e RUN_TYPE=connections -e COLLECTION=opinion_leaders makhela/collector_2.0.32 > /root/logs/connections-collection
```
```docker
0 */1 * * *     /usr/bin/docker run --rm --name suggestions-collection -e consumer_key=XXX -e consumer_secret=XXX -e access_token=XXX -e access_token_secret=XXX -e db_username=XXX -e db_password=XXX -e slack_url=XXX  makhela/suggestions_2.0.32 > /root/logs/suggestions-collection
```