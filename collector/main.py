from source_handlers import twitter
import collector as clt

def main():
    twitter_handler = twitter.Twitter_handler()
    collector = clt.Collector(twitter_handler)


if __name__ == "__main__":
    main()
    exit(0)
