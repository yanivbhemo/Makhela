import os


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