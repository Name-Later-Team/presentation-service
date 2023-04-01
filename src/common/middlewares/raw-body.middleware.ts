import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

/**
 * @description This middleware handles parsing body data into text string and json body payload.
 * - This midd must be placed before RsaAuthMiddleware
 * - Only process when content-type = 'application/json+text'
 */
@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const headerContentType = req.headers["content-type"];
        if (!headerContentType || !headerContentType.includes("application/json+text")) {
            next();
            return;
        }

        const rawPayload = req.body;

        req.text = rawPayload.toString();
        req.body = JSON.parse(rawPayload);

        next();
    }
}
