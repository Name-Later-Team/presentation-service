import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable, tap } from "rxjs";
import { Common } from "../utils";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly _logger: Logger = new Logger("IncomingRequest");

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const startTime = process.hrtime();

		return next.handle().pipe(
			tap((data: any) => {
				const request = context.switchToHttp().getRequest<Request>();
				const response = context.switchToHttp().getResponse<Response>();

				const totalTime = process.hrtime(startTime);
				const totalTimeInMs = totalTime[0] * 1000 + totalTime[1] / 1000000;

				const message = Common.getIncomingRequestInfo(request, response).join(" - ") + ` - ${totalTimeInMs}ms`;
				this._logger.log(message);
			}),
		);
	}
}
