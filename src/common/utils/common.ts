import { Request, Response } from "express";

function getIncomingRequestInfo(request: Request, response: Response) {
    const { ip, method, originalUrl, httpVersion } = request;
    const userAgent = request.get("user-agent") || "";

    const { statusCode } = response;
    const requestId = response.get("X-Request-Id");
    const contentLength = response.get("content-length");

    return [ip, method, originalUrl, `HTTP ${httpVersion}`, statusCode, contentLength, userAgent, requestId];
}

function isNullOrUndefined(value: any): value is null | undefined {
    return value === null || value === undefined;
}

export const Common = {
    getIncomingRequestInfo,
    isNullOrUndefined,
};
