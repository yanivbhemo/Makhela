import os


def load_env_variables():
    #For the ranking system
    os.environ['MAX_LEVEL_OF_CERTAINTY'] = '10'
    os.environ['AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY'] = '7'
    os.environ['AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY'] = '5'
    os.environ['AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY'] = '2'
    os.environ['MIN_LEVEL_OF_CERTAINTY'] = '0'