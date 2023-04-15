import { Controller, Get, HttpCode, Inject } from "@nestjs/common";
import { IPresentationActionPublisher } from "./core/brokers";
import { DataResponse } from "./core/response";
import { PRESENTATION_ACTION_PUB_TOKEN } from "./infrastructure/brokers/publishers/presentation-action.publisher";

@Controller()
export class AppController {
    constructor(@Inject(PRESENTATION_ACTION_PUB_TOKEN) private sub: IPresentationActionPublisher) {}

    @Get()
    getHomePage() {
        return new DataResponse({ service: "Presentation Service", version: "v1" });
    }

    @Get("favicon.ico")
    @HttpCode(204)
    getFavicon() {}

    // TODO: must be replaced
    @Get("test")
    async testQueue() {
        const res = await this.sub.publish({ text: "Demo" });
        console.log(res);

        return "OK";
    }
}
