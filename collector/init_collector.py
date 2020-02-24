from pymongo import MongoClient
import csv

def Connect_To_db():
    # connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
    client = MongoClient(
        "mongodb+srv://" + username + ":" + password + "@makhela-qvsh8.mongodb.net/Makhela?retryWrites=true&w=majority")
    db = client.Makhela
    return db

def init():
    db = Connect_To_db()
    #Checks if the collection is empty
    if(db.opinion_leaders.count_documents({})==0):
        init_opinion_leaders_names={
            "Ariane M. Tabatabai",
            "Suzanne Maloney",
            "Mehdi Khalaji",
            "Alireza Nader",
            "Dalia Dassa Kaye",
            "Karim Sadjadpour",
            "Richard (Dick) Sokolsky",
            "George Perkovich",
            "Mark Hibbs",
            "Suzanne DiMaggio",
            "Mark Dubowitz",
            "Reuel Mark Gerecht",
            "Richard Goldberg",
            "Olli Heinonen",
            "Pierre Goldschmidt",
            "David Albright",
            "Emanuele Ottolenghi",
            "Juan Zarate",
            "David Albright",
            "Robert Einhorn",
            "Djavad Salehi-Isfahani",
            "Norman T. Roule",
            "Dennis B. Ross",
            "Colin Kahl",
            "Jon B. Wolfstahl",
            "Gary Samore",
            "Jeffrey Lewis",
            "Ray Takeyh",
            "Vali Nasr",
            "Graham Allison",
            "Michael Eisenstadt",
            "Barbara A. Leaf",
            "Patrick Clawson",
            "Anthony Cordesman",
            "Barbara Slavin",
            "Trita Parsi",
            "Mohammad Ali Shabani",
            "Ellie Geranmayeh ",
            "Esfandyar Batmanghelidj",
            "Ali Vaez",
            "Shahram Chubin",
            "Michael Eisenstadt",
            "Ali Alfoneh",
            "Matthew Kroenig",
            "Barbara Slavin",
            "Holly Dagres",
            "Jerrold D. Green",
            "John Calabrese",
            "William Yong",
            "Ahmad Majidyar",
            "Afshon Ostovar",
            "Mark Fitzpatrick",
            "Kenneth M. Pollack",
            "Michael Elleman",
            "Raz  Zimmt",
            "Tal Inbar",
            "Uzi Rubin",
            "Sima Schein",
            "Amos Yadlin",
            "Emily Landau",
            "Ephraim Asculai",
            "Ariel (Eli) Levite",
            "Yaniv Ben Hamo"
        }
        for leader in init_opinion_leaders_names:
            print("Handling: " + leader)
            record = {
                "full_name": leader
            }
            # Checks if the leader already exist, if not add him/her
            result = db.opinion_leaders.find_one(record)
            if(result==None):
                result = db.opinion_leaders.insert_one(record)
                print('Record {0} created'.format(result.inserted_id))

###################################################################################
# get user creds from config file
with open(".config.txt", newline='') as config_file:
    config_list = csv.reader(config_file, delimiter=':')
    for row in config_list:
        if(row[0]=="db_user"):
            username = row[1]
            password = row[2]
            break
init()
exit(0)