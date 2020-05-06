import os
import requests

def load_thresholds(db_handler):
    os.environ['MAX_LEVEL_OF_CERTAINTY'] = db_handler.get_system_settings("MAX_LEVEL_OF_CERTAINTY")
    os.environ['AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY'] = db_handler.get_system_settings("AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY")
    os.environ['AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY'] = db_handler.get_system_settings("AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY")
    os.environ['AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY'] = db_handler.get_system_settings("AFTER_RESOLVE_LOW_LEVEL_OF_CERTAINTY")
    os.environ['MIN_LEVEL_OF_CERTAINTY'] = db_handler.get_system_settings("MIN_LEVEL_OF_CERTAINTY")
    os.environ['MIN_AMOUNT_OF_FOLLOWERS'] = db_handler.get_system_settings("MIN_AMOUNT_OF_FOLLOWERS")
    os.environ['MID_AMOUNT_OF_FOLLOWERS'] = db_handler.get_system_settings("MID_AMOUNT_OF_FOLLOWERS")
    os.environ['MAX_AMOUNT_OF_FOLLOWERS'] = db_handler.get_system_settings("MAX_AMOUNT_OF_FOLLOWERS")
    os.environ['MIN_AMOUNT_OF_STATUSES'] = db_handler.get_system_settings("MIN_AMOUNT_OF_STATUSES")