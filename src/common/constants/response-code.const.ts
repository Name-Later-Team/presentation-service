export const HTTP_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    CREATED: 201,
    NO_CONTENT: 204,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

export const RESPONSE_CODE = {
    // 400: BAD REQUEST
    VALIDATION_ERROR: 4001,
    PRESENTATION_NOT_FOUND: 4002,
    PRESENTING_PRESENTATION: 4003,
    SLIDE_NOT_FOUND: 4004,
    VOTING_CODE_NOT_FOUND: 4005,
    DELETE_ONLY_SLIDE: 4006,

    // 401: UNAUTHORIZED
    MISSING_TOKEN: 4011,
    MISSING_RSA_AUTH_HEADER: 4012,
    INVALID_SIGNATURE: 4013,

    // 403: FORBIDDEN
};
