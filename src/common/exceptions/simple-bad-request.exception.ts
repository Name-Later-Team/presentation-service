import { BaseException } from "../../core/exceptions/base.exception";
import { HTTP_CODE } from "../constants";

export class SimpleBadRequestException extends BaseException {
    /**
     *
     * @param responseCode Custom response code for specific error situation
     * @param message Client readable message
     */
    constructor(responseCode: number, message = "Bad Request") {
        super(HTTP_CODE.BAD_REQUEST, message, responseCode);
    }
}
