import os
import requests


def load_env_variables():
    os.environ['MAX_LEVEL_OF_CERTAINTY'] = '10'
    os.environ['AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY'] = '7'
    os.environ['AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY'] = '5'
    os.environ['AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY'] = '2'
    os.environ['MIN_LEVEL_OF_CERTAINTY'] = '0'
    os.environ['MIN_AMOUNT_OF_FOLLOWERS'] = '1000'
    os.environ['MID_AMOUNT_OF_FOLLOWERS'] = '3000'
    os.environ['MAX_AMOUNT_OF_FOLLOWERS'] = '6000'
    os.environ['MIN_AMOUNT_OF_STATUSES'] = '5000'

    # For authentication purposes
    # ---------------------------------
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