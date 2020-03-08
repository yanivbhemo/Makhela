from source_handlers import twitter
import collector as clt
from db_handlers import mongodb


def main():
    twitter_handler = twitter.Twitter_handler()
    db_handler = mongodb.DataBaseHandler()
    collector = clt.Collector(twitter_handler, db_handler)
    collector.collect()


if __name__ == "__main__":
    main()
    exit(0)
