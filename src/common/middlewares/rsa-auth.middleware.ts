import * as sdk from "@huyleminh/nodejs-sdk";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { APP_CONFIG } from "src/infrastructure/configs";
import { RESPONSE_CODE } from "../constants";
import { UnauthorizedException } from "../exceptions";

@Injectable()
export class RsaAuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        next();
        // const requestTime = req.header("Request-Time");
        // const clientId = req.header("Client-Id");
        // const xAuthorization = req.header("Signature");
        // const resourceUri = req.header("Resource-Uri");
        // const httpMethod = req.method;

        // if (!requestTime || !clientId || !xAuthorization || !resourceUri || !httpMethod) {
        //     throw new UnauthorizedException("Missing header information", RESPONSE_CODE.MISSING_RSA_AUTH_HEADER);
        // }

        // const payload = req.text ?? "";

        // const verifySetting = {
        //     publicKey: APP_CONFIG.rsa.publicKey,
        //     payload,
        //     headers: { requestTime, httpMethod, clientId, resourceUri, xAuthorization },
        // };

        // try {
        //     const validator = new sdk.RsaValidator(verifySetting);

        //     if (!validator.verifySignature()) {
        //         throw new UnauthorizedException("Invalid signature", RESPONSE_CODE.INVALID_SIGNATURE);
        //     }

        //     next();
        // } catch (error) {
        //     next(error);
        // }
    }
}
