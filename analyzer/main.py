from datetime import datetime
import db_connection
import myanalyzer
import logger

def get_password():
    if os.getenv('environment') == 'production':
        return os.getenv('db_password')
    f = open("password.txt", "r")
    pwd = f.read()
    f.close()
    return pwd

def main():
    log = logger.logger_handler()
    now = datetime.now()
    if os.getenv('environment') == 'production':
        username = os.getenv('db_username')
    else:
        username = 'sveta'
    pwd = get_password()
    log.send_message_to_logfile("Analyzer: "+str(now))

    community = db_connection.Community(username, pwd)
    leaders, posts, key_words = community.get_community()

    analyzer = myanalyzer.Analyzer(leaders, posts, key_words)
    leaders, posts, topics = analyzer.analyze_community()

    community.save_topics(topics)
    community.save_community(leaders, posts)
    

if __name__ == "__main__":
    main()
    exit(0)