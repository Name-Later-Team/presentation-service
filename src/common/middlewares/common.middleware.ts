import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export function trackingMiddleware(req: Request, res: Response, next: NextFunction) {
	const requestId = uuidv4();
	res.set("X-Request-Id", requestId);
	next();
}
