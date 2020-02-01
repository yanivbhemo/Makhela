#!/usr/bin/env python
# coding: utf-8

# In[57]:

config_file=open()
quit()
import tweepy
import json
import requests
import pymongo
from pprint import pprint
#import dnspython


# In[14]:


## DB Connection ##
###DONT FORGET TO REMOVE PASSWORD###
client = pymongo.MongoClient("mongodb+srv://yaniv:<password>@makhela-qvsh8.mongodb.net/test?retryWrites=true&w=majority")
db = client.search_stock


# In[23]:


## Twitter connection ##
consumer_key = 
consumer_secret = 
access_token = 
access_token_secret = 
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)


# In[64]:


influencers_names = ["ArianeTabatabai","SuzanneMaloney","MehdiKhalaji","Alireza Nader","Dalia Dassa Kaye","Karim Sadjadpour","Richard (Dick) Sokolsky","George Perkovich","Mark Hibbs","Suzanne DiMaggio","Mark Dubowitz","Reuel Mark Gerecht","Richard Goldberg","Olli Heinonen","Pierre Goldschmidt","David Albright","Emanuele Ottolenghi","Juan Zarate","Robert Einhorn","Djavad Salehi-Isfahani","Norman T. Roule","Dennis B. Ross","Colin Kahl","Jon B. Wolfstahl","Gary Samore","Jeffrey Lewis","Ray Takeyh","Vali Nasr","Graham Allison","Michael Eisenstadt","Barbara A. Leaf","Patrick Clawson","Anthony Cordesman","Barbara Slavin","Trita Parsi","Mohammad Ali Shabani","Ellie Geranmayeh","Esfandyar Batmanghelidj","Ali Vaez","Shahram Chubin","Michael Eisenstadt","Ali Alfoneh","Matthew Kroenig","Barbara Slavin","Holly Dagres","Jerrold D.Green","John Calabrese","William Yong","Ahmad Majidyar","Afshon Ostovar","Mark Fitzpatrick","Kenneth M. Pollack","Michael Elleman","Raz  Zimmt","Tal Inbar","Uzi Rubin","Sima Schein","Amos Yadlin","Emily Landau","Ephraim Asculai","Ariel (Eli) Levite"]
for person in influencers_names:
    print("Search for: " + person)
    try:
        user = api.get_user(person)
        print("Found! User id: " + str(user.id))
    except tweepy.TweepError as e:
        pprint(e)  # prints 34
        break


# In[5]:


public_tweets = api.home_timeline()
for tweet in public_tweets:
    print(tweet.text)


# In[19]:


user_id = api.get_user("realdonaldtrump").id


# In[20]:


user_tweets = api.user_timeline(user_id,count=1)


# In[14]:


print(user_tweets)


# In[35]:


for tweet in user_tweets:
    print("User - " + str(user_id))
    print("Id - " + str(tweet.id))
    print("Created_at - " + str(tweet.created_at))
    print("Text - " + str(tweet.text))


# In[8]:





# In[ ]:




