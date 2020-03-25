import datetime
from source_handlers import twitter
import suggestion_collector as clt
from db_handlers import mongodb
import logger
import collection_config


def main():
    log_handler = logger.logger_handler()
    twitter_handler = twitter.Twitter_handler(log_handler)
    db_handler = mongodb.DataBaseHandler(log_handler)
    collector = clt.Suggestion_Collector(log_handler, twitter_handler, db_handler)
    collector.collect()
    log_handler.close_logfile()


if __name__ == "__main__":
    collection_config.load_env_variables()
    main()
    exit(0)
