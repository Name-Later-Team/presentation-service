import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";
import { DataResponse } from "src/core/response";

describe("AppController", () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [
                AppService,
                // {
                //     provide: PRESENTATION_ACTION_PUB_TOKEN,
                //     useValue: {
                //         getResult: jest.fn(),
                //     },
                // },
            ],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe("root", () => {
        it("should return service information (name and version)", () => {
            const resp = new DataResponse({ service: "Presentation Service", version: "v1" });
            expect(appController.getHomePage()).toEqual(resp);
        });
    });
});
