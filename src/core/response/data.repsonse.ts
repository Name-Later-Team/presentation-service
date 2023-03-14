import { BaseResponse } from "./base.response";

export class DataResponse extends BaseResponse {
    constructor(data: any, message: string = "OK") {
        super(200, 200, message, data);
    }
}
