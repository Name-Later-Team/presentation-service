import { BaseException } from "./base.exception";

export class UnAuthorizedException extends BaseException {
    constructor(message: string, code: number) {
        super(401, message, code);
    }
}
