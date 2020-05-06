import datetime
from source_handlers import twitter
import collector as clt
from db_handlers import mongodb
import logger
import collection_config
import sys


def main():
    log_handler = logger.logger_handler()
    twitter_handler = twitter.Twitter_handler(log_handler)
    db_handler = mongodb.DataBaseHandler(log_handler)
    collection_config.load_thresholds(db_handler)
    db_handler.unlock_all_opinion_leaders()
    log_handler.send_message_to_logAndSlack(str(datetime.datetime.now()) + " - Collection cycle of type: " + sys.argv[1] + " started from a container")
    collector_opinion_leaders = clt.Collector(log_handler, twitter_handler, db_handler, sys.argv[2])
    if sys.argv[1] == "tweets":
        collector_opinion_leaders.collect_tweets()
    elif sys.argv[1] == "connections":
        collector_opinion_leaders.collect_connections()
    elif sys.argv[1] == "refresh_init_details":
        collector_opinion_leaders.update_opinion_leaders_information()
    log_handler.send_message_to_logAndSlack(str(datetime.datetime.now()) + " - Collection cycle finished")
    log_handler.close_logfile()


if __name__ == "__main__":
    main()
    exit(0)
