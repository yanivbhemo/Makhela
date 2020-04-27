export const OPINION_LEADERS_SIZE = "http://localhost:3000/opinion_leaders/getCommunitySize"
export const SUGGESTIONS_COLLECTION_SIZE = "http://localhost:3000/suggestions/getSize"
export const POSTS_COLLECTION_SIZE = "http://localhost:3000/posts/getSize"

// Logger format
export const customJSON = log => ({
    msg: log.message,
    level: log.level.label,
    stacktrace: log.stacktrace
});
export const logger_url = "http://localhost:3000/logs/new"