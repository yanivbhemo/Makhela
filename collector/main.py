import datetime
from source_handlers import twitter
import collector as clt
from db_handlers import mongodb
import logger


def main():
    log_handler = logger.logger_handler()
    twitter_handler = twitter.Twitter_handler(log_handler)
    db_handler = mongodb.DataBaseHandler(log_handler)
    db_handler.unlock_all_opinion_leaders()
    log_handler.send_message_to_logfile(str(datetime.datetime.now()) + " - Collection cycle started from a container")
    collector = clt.Collector(log_handler, twitter_handler, db_handler, "opinion_leaders")
    collector.collect_tweets()
    log_handler.send_message_to_logfile(str(datetime.datetime.now()) + " - Collection cycle finished")
    log_handler.close_logfile()


if __name__ == "__main__":
    main()
    exit(0)
