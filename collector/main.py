import datetime
from source_handlers import twitter
import collector as clt
from db_handlers import mongodb
import logger


def main():
    twitter_handler = twitter.Twitter_handler()
    db_handler = mongodb.DataBaseHandler()
    logger.send_message_to_slack(str(datetime.datetime.now()) + " - Collection cycle started from a container")
    collector = clt.Collector(twitter_handler, db_handler)
    collector.collect()
    logger.send_message_to_slack(str(datetime.datetime.now()) + " - Collection cycle finished")


if __name__ == "__main__":
    main()
    exit(0)
