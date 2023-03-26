import { BaseResponse } from "./base.response";

export class DataResponse extends BaseResponse {
    constructor(data: any, message: string = "OK") {
        super(200, 200, message, data);
    }
}

export class CreatedResponse extends BaseResponse {
    constructor(data?: any, message: string = "Created") {
        super(201, 201, message, data);
    }
}
