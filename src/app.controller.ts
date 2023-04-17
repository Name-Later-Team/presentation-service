import { Controller, Get, HttpCode } from "@nestjs/common";
import { DataResponse } from "./core/response";

@Controller()
export class AppController {
    constructor() {}

    @Get()
    getHomePage() {
        return new DataResponse({ service: "Presentation Service", version: "v1" });
    }

    @Get("favicon.ico")
    @HttpCode(204)
    getFavicon() {}
}
