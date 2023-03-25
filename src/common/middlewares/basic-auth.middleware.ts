import { NextFunction, Request, Response } from "express";
import { RESPONSE_CODE } from "../constants";
import { UnauthorizedException } from "../exceptions";
import * as jwt from "jsonwebtoken";

/**
 * @description Checking token in header - Authorization and decode token information.
 * Assume that the current token has valdiated by the API Gateway
 */
export function basicAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    // get token information from header
    const authorization = req.headers.authorization || "";
    const token = authorization.split(" ")[1];

    if (!token) {
        throw new UnauthorizedException("Token is missing or invalid", RESPONSE_CODE.MISSING_TOKEN);
    }

    const data = jwt.decode(token, { complete: true, json: true });

    if (!data) {
        throw new UnauthorizedException("Token is missing or invalid", RESPONSE_CODE.MISSING_TOKEN);
    }

    const { payload } = data;

    req.userinfo = {
        username: payload["name"],
        identifier: payload["id"],
        type: payload["type"],
        displayName: payload["displayName"],
        firstName: payload["firstName"],
        lastName: payload["lastName"],
        avatar: payload["avatar"],
        email: payload["email"],
    };

    next();
}
