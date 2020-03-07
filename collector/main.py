from source_handlers import twitter
import collector as clt
import db_handler as db_hnl


def main():
    twitter_handler = twitter.Twitter_handler()
    db_handler = db_hnl.DataBaseHandler()
    collector = clt.Collector(twitter_handler, db_handler)
    collector.collect()



if __name__ == "__main__":
    main()
    exit(0)