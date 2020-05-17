from datetime import datetime
import db_connection
import myanalyzer
import logger

def get_password():
    f = open("password.txt", "r")
    pwd = f.read()
    f.close()
    return pwd

def main():
    log = logger.logger_handler()
    now = datetime.now()

    log.send_message_to_logfile("Analyzer: "+str(now))


    community = db_connection.Community(username, pwd)
    leaders, posts, key_words = community.get_community()

    analyzer = myanalyzer.Analyzer(leaders, posts, key_words)
    leaders, posts = analyzer.analyze_community()

    community.save(leaders, posts)

if __name__ == "__main__":
    username = 'sveta'
    pwd = get_password()
    main()
    exit(0)