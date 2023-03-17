import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { map, Observable } from "rxjs";
import { BaseResponse } from "src/core/response";

@Injectable()
export class ResponseMappingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		return next.handle().pipe(
			map((data: any) => {
				if (data instanceof BaseResponse) {
					return data.toJSONResponse();
				}

				return data;
			}),
		);
	}
}
