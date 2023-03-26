import { BaseException } from "../../core/exceptions/base.exception";

export class RequestValidationException extends BaseException {
    /**
     *
     * @param message Client readable message
     * @param errorDetails Validation error object description
     */
    constructor(message: string, errorDetails: any) {
        super(400, "Validation error", 4001, {
            error: message,
            errorDetails,
        });
    }
}
