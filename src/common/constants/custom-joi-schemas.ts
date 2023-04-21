import * as Joi from "joi";
import * as _ from "lodash";

export const STRINGIFIED_JSON_OBJECT_SCHEMA = Joi.extend({
    type: "stringifiedObject",
    base: Joi.object(),
    messages: {
        "stringifiedObject.base": "{{#label}} must be a stringified object",
    },
    coerce: {
        from: "string",
        method: (value, helpers) => {
            if (typeof value !== "string") {
                return {
                    errors: [helpers.error("stringifiedObject.base")],
                };
            }

            try {
                const obj = JSON.parse(value);
                if (!_.isObjectLike(obj)) {
                    return {
                        errors: [helpers.error("stringifiedObject.base")],
                    };
                }

                return { value: obj };
            } catch (error) {
                return {
                    errors: [helpers.error("stringifiedObject.base")],
                };
            }
        },
    },
});
