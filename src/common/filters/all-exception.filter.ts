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

        let outMessage;

        if (exception instanceof BaseException) {
            status = exception.status;

            responseError.code = exception.code;
            responseError.message = exception.message;
            responseError.data = exception.response;

            outMessage = exception.errors && exception.toString();
        }

        // handle error detaisl base on its name
        switch (exception.name) {
            case "RequestValidationException":
            case "SimpleBadRequestException":
                break;
            case "NotFoundException":
                status = 404;
                responseError.code = status;
                responseError.message = exception.message;
                break;
            case "UnauthorizedException":
                outMessage = exception.toString();
                break;
            case "RsaException":
                status = 401;
                responseError.code = status;
                responseError.message = "Unauthorized";
                outMessage = `RsaException - ${exception.message}`;
                break;
            default:
                outMessage = exception;
                break;
        }

        // store error logging message
        outMessage && this._logger.error(outMessage);

        // Send error response
        response.statusCode = status;

        const incomingRequestInfo = Common.getIncomingRequestInfo(request, response);
        this._logger.log(incomingRequestInfo.join(" - "), "IncomingRequest");

        response.status(status).json(responseError);
    }
}
