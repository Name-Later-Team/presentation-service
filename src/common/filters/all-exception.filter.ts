import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { BaseException } from "src/core/exceptions/base.exception";
import { Common } from "../utils";

/**
 * @description Handling all exceptions
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly _logger: Logger) {}

    catch(exception: any, host: ArgumentsHost): void {
        const request = host.switchToHttp().getRequest<Request>();
        const response = host.switchToHttp().getResponse<Response>();

        let status = 500;
        const responseError = {
            code: 500,
            message: "Unknown error occured",
        } as { code: number; message: string; data: any };

        let outMessage = exception;

        if (exception instanceof BaseException) {
            status = exception.status;

            responseError.code = exception.code;
            responseError.message = exception.message;
            responseError.data = exception.response;

            outMessage = exception.toString();
        }

        if (exception instanceof Error) {
            outMessage = `${exception.name} - ${exception.message}`;
        }

        // store error logging message
        this._logger.error(outMessage);

        // handle error detaisl base on its name
        // const errorName = exception?.name ?? "UnknownException";
        // switch (errorName) {
        //     case "UnAuthorizedException":
        //         break;
        //     default:
        //         break;
        // }

        // Send error response
        response.statusCode = status;

        const incomingRequestInfo = Common.getIncomingRequestInfo(request, response);
        this._logger.log(incomingRequestInfo.join(" - "), "IncomingRequest");

        response.status(status).json(responseError);
    }
}
