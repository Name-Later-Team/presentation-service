import { BaseException } from "../../core/exceptions";

export class UnauthorizedException extends BaseException {
    constructor(message: string, code: number) {
        super(401, message, code);
    }
}
