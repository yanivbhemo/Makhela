import os
import requests


def load_env_variables():
    #For authentication purposes
    #---------------------------------
    headers = {"X-Vault-Token": os.getenv('vault_ro_token')}
    r = requests.get("https://collector02.makhela.live:8200/v1/kv/slack", headers=headers).json()
    os.environ['slack_url'] = r['data']['slack_url']
    r = requests.get("https://collector02.makhela.live:8200/v1/kv/db_auth", headers=headers).json()
    os.environ['db_username'] = r['data']['username']
    os.environ['db_password'] = r['data']['password']
    r = requests.get("https://collector02.makhela.live:8200/v1/kv/twitter", headers=headers).json()
    os.environ['consumer_key'] = r['data']['consumer_key']
    os.environ['consumer_secret'] = r['data']['consumer_secret']
    os.environ['access_token'] = r['data']['access_token']
    os.environ['access_token_secret'] = r['data']['access_token_secret']

def load_thresholds(db_handler):
    # For the ranking system
    os.environ['MAX_LEVEL_OF_CERTAINTY'] = db_handler.get_system_settings("MAX_LEVEL_OF_CERTAINTY")
    os.environ['AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY'] = db_handler.get_system_settings("AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY")
    os.environ['AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY'] = db_handler.get_system_settings("AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY")
    os.environ['AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY'] = db_handler.get_system_settings("AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY")
    os.environ['MIN_LEVEL_OF_CERTAINTY'] = db_handler.get_system_settings("MIN_LEVEL_OF_CERTAINTY")