import { BaseException } from "../../core/exceptions/base.exception";
import { HTTP_CODE } from "../constants";

export class ForbiddenRequestException extends BaseException {
    /**
     *
     * @param responseCode Custom response code for specific error situation
     * @param message Client readable message
     */
    constructor(responseCode: number, message = "Forbidden") {
        super(HTTP_CODE.BAD_REQUEST, message, responseCode);
    }
}
