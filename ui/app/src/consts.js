var url = "http://localhost:3002"

if(process.env.NODE_ENV === "production")
    url = "https://makhela.live/api"

export const OPINION_LEADERS_SIZE = url + "/opinion_leaders/getCommunitySize"
export const SUGGESTIONS_COLLECTION_SIZE = url + "/suggestions/getSize"
export const POSTS_COLLECTION_SIZE = url + "/posts/getSize"
export const AUTHENTICATION_URL = url + "/users/auth2"
export const AUTH_CHECK = url + "/users/checkToken"
export const AUTH_CHECK_TOKEN = url + "/users/checkToken/"
export const GET_ALL_LEADERS = url + "/opinion_leaders/getAllLeaders"
export const GET_LEADERS_BY_RANGE = url + "/opinion_leaders/getLeadersByRange"
export const GET_ALL_LEADERS_LIMITED = url + "/opinion_leaders/getAllLeadersLimited"
export const MOVE_LEADER_TO_BLACKLIST = url + "/opinion_leaders/moveToBlackList"
export const GET_ALL_LEADERS_LOCATIONS = url + "/opinion_leaders/getLocations"
export const GET_SPECIFIC_LOCATION_LEADERS = url + "/opinion_leaders/getLocations"
export const ADD_NEW_LEADER = url + "/opinion_leaders/addNewLeader"
export const GET_SPECIFIC_LEADER = url + "/opinion_leaders/leader/"
export const GET_LEADER_POSTS = url + "/posts/getLeaderPosts/"
export const GET_LEADER_FRIENDS = url + "/opinion_leaders/leader/getLeaderFriends/"
export const GET_LEADER_SHORT_DETAILS = url + "/opinion_leaders/getLeaderShortDetails/"

//Suggestions
export const SUGGESTIONS_SIZE = url + "/suggestions/getSize"
export const GET_ALL_SUGGESTIONS = url + "/suggestions/getAllSuggestions"
export const GET_SUGGESTIONS_BY_RANGE = url + "/suggestions/getSuggestionsByRange"
export const GET_ALL_SUGGESTIONS_LIMITED = url + "/suggestions/getAllSuggestionsLimited"
export const MOVE_SUGGESTIONS_TO_BLACKLIST = url + "/suggestions/moveToBlackList"
export const MOVE_SUGGESTIONS_TO_COMMUNITY = url + "/suggestions/moveToCommunity"
export const GET_ALL_SUGGESTIONS_LOCATIONS = url + "/suggestions/getLocations"
export const GET_SPECIFIC_LOCATION_SUGGESTIONS = url + "/suggestions/getLocations"
export const GET_SPECIFIC_SUGGESTIONS = url + "/suggestions/suggestion/"
export const GET_SUGGESTIONS_FRIENDS = url + "/suggestions/suggestion/getSuggestionFriends/"
export const GET_SUGGESTIONS_SHORT_DETAILS = url + "/suggestions/getSuggestionShortDetails/"

//BlackList
export const BLACKLIST_SIZE = url + "/blacklist/getSize"
export const GET_ALL_BLACKLISTS = url + "/blacklist/getAllBlackListLeaders"
export const GET_BLACKLISTS_BY_RANGE = url + "/blacklist/getBlackListLeadersByRange"
export const GET_ALL_BLACKLISTS_LIMITED = url + "/blacklist/getAllBlackListLeadersLimited"
export const MOVE_BLACKLISTS_TO_COMMUNITY = url + "/blacklist/moveToCommunity/"
export const GET_ALL_BLACKLISTS_LOCATIONS = url + "/blacklist/getLocations"
export const GET_SPECIFIC_LOCATION_BLACKLISTS = url + "/blacklist/getLocations"
export const GET_SPECIFIC_BLACKLISTS = url + "/blacklist/"
export const GET_BLACKLISTS_FRIENDS = url + "/blacklist/getBlackListLeaderFriends/"
export const GET_BLACKLISTS_SHORT_DETAILS = url + "/blacklist/getBlackListLeaderShortDetails/"

//Init
export const INIT_SYSTEM = url + "/initiation"
export const FORMAT_SYSTEM = url + "/system/init"
export const CHECK_IF_SYSTEM_INIT = url + "/system/init_status"
export const GET_ALL_SYSTEMS_SETTINGS = url + "/system/getAllSettings"
export const UPDATE_SETTING = url + "/system/updateSetting"
export const GET_ALL_KEYWORDS = url + "/system/getAllKeywords"
export const DELETE_KEYWORD = url + "/system/deleteKeyword"
export const ADD_KEYWORD = url + "/system/addKeyword"

//Find Alt Lng
export const ALT_LNG = "http://open.mapquestapi.com/geocoding/v1/address?"

//Graph
export const GET_GRAPH_LEADERS = url + "/graph/getLeaders"
export const GET_GRAPH_POSTS = url + "/graph/getPosts"


