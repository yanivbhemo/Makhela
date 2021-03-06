from source_handlers import twitter
import suggestion_collector as clt
from db_handlers import mongodb
import logger
import collection_config


def main():
    log_handler = logger.logger_handler()
    twitter_handler = twitter.Twitter_handler(log_handler)
    db_handler = mongodb.DataBaseHandler(log_handler)
    collection_config.load_thresholds(db_handler)
    collector = clt.Suggestion_Collector(log_handler, twitter_handler, db_handler)
    log_handler.send_message_to_logfile("Suggestions Collector Begin cycle")
    collector.collect()
    log_handler.send_message_to_logfile("Suggestions Collector End cycle")
    log_handler.close_logfile()


if __name__ == "__main__":
    main()
    exit(0)
