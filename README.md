# Makhela
Makhela is a semi-autonomous intelligence system for gather community opinions from varies information sources  

## Run Tweets Collector engine using docker
```yml
docker run --name tweets-collection  -e consumer_key=XXX -e consumer_secret=XXX -e access_token=XXX -e access_token_secret=XXX -e db_username=XXX -e db_password=XXX -e slack_url=XXX -e RUN_TYPE=tweets -e COLLECTION=opinion_leaders makhela/collector_2.0.32
```

## Run Connections Collector engine using docker
```yml
docker run --name tweets-collection  -e consumer_key=XXX -e consumer_secret=XXX -e access_token=XXX -e access_token_secret=XXX -e db_username=XXX -e db_password=XXX -e slack_url=XXX -e RUN_TYPE=Connections -e COLLECTION=opinion_leaders makhela/collector_2.0.32
```