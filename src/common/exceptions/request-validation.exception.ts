import { BaseException } from "../../core/exceptions/base.exception";
import { HTTP_CODE, RESPONSE_CODE } from "../constants";

export class RequestValidationException extends BaseException {
    /**
     *
     * @param message Client readable message
     * @param errorDetails Validation error object description
     */
    constructor(message: string, errorDetails: any) {
        super(HTTP_CODE.BAD_REQUEST, "Validation error", RESPONSE_CODE.VALIDATION_ERROR, {
            error: message,
            errorDetails,
        });
    }
}
