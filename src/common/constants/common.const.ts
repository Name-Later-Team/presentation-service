export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
};

export enum PRESENTATION_SLIDE_TYPE {
    MULTIPLE_CHOICE = "multiple_choice",
    HEADING = "heading",
    PARAGRAPH = "paragraph",
}

export enum PRESENTATION_PACE_STATE {
    IDLE = "idle",
    PRESENTING = "presenting",
}

export const VOTING_CODE_GENERATION_RETRY_ATTEMPTS = 3;
