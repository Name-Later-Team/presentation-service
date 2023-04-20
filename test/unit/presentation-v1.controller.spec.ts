import { Test } from "@nestjs/testing";
import { Request } from "express";
import { VOTING_CODE_GENERATION_RETRY_ATTEMPTS } from "src/common/constants";
import { CreatedResponse } from "src/core/response";
import { PRESENTATION_SERVICE_TOKEN, PresentationService } from "src/infrastructure/services";
import { PresentationControllerV1 } from "src/modules/presentations/presentation-v1.controller";

describe("PresentationControllerV1", () => {
    let controller: PresentationControllerV1;
    let service: PresentationService;

    const requestMock = {
        userinfo: {
            username: "anhle199",
            identifier: "f8791fe7-a845-493d-ad87-0288d1985777",
            type: "",
            displayName: "Le Hoang Anh",
            firstName: "Le",
            lastName: "Anh",
            avatar: "",
            email: "example@gmail.com",
        },
        text: "",
    } as Request;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            controllers: [PresentationControllerV1],
            providers: [
                {
                    provide: PRESENTATION_SERVICE_TOKEN,
                    useValue: {
                        createPresentationWithDefaultSlideAsync: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<PresentationControllerV1>(PresentationControllerV1);
        service = module.get(PRESENTATION_SERVICE_TOKEN);
    });

    describe("createPresentationAsync", () => {
        const presentationMock = {
            id: 1,
            createdAt: new Date(), //"2023-04-18T17:58:24.969Z"
            updatedAt: new Date(), //"2023-04-18T17:58:25.110Z"
            name: "Presentation 1",
            identifier: "3739d434-4d89-4a5d-b4dd-3c9401431044",
            ownerIdentifier: "f8791fe7-a845-493d-ad87-0288d1985777",
            ownerDisplayName: "Le Hoang Anh",
            pace: {
                mode: "presenter",
                active_slide_id: 13,
                state: "idle",
                counter: 0,
            },
            closedForVoting: false,
            totalSlides: 1,
        };

        it("Created", async () => {
            jest.spyOn(service, "createPresentationWithDefaultSlideAsync").mockImplementation((_) =>
                Promise.resolve(presentationMock.identifier),
            );

            const createdResp = await controller.createPresentationAsync(requestMock, {
                name: presentationMock.name,
            });

            expect(service.createPresentationWithDefaultSlideAsync).toHaveBeenCalledWith({
                presentationName: presentationMock.name,
                userDisplayName: requestMock.userinfo.displayName,
                userId: requestMock.userinfo.identifier,
            });
            expect(service.createPresentationWithDefaultSlideAsync).toHaveReturnedWith(
                Promise.resolve(presentationMock.identifier),
            );
            expect(createdResp).toStrictEqual(new CreatedResponse());
        });

        it("Throw error when generating voting code", async () => {
            const maxRetryErrorMessage = `Max retry count (1 + ${VOTING_CODE_GENERATION_RETRY_ATTEMPTS} retry) for regenerating voting code`;
            const maxRetryError = new Error(maxRetryErrorMessage);

            jest.spyOn(service, "createPresentationWithDefaultSlideAsync").mockImplementation(() => {
                throw maxRetryError;
            });

            const dataToCreate = {
                presentationName: presentationMock.name,
                userDisplayName: presentationMock.ownerDisplayName,
                userId: presentationMock.ownerIdentifier,
            };

            expect(() => service.createPresentationWithDefaultSlideAsync(dataToCreate)).toThrow();
            expect(() => service.createPresentationWithDefaultSlideAsync(dataToCreate)).toThrow(Error);
            expect(() => service.createPresentationWithDefaultSlideAsync(dataToCreate)).toThrow(maxRetryErrorMessage);
            expect(() => service.createPresentationWithDefaultSlideAsync(dataToCreate)).toThrow(maxRetryError);

            try {
                await service.createPresentationWithDefaultSlideAsync({
                    presentationName: presentationMock.name,
                    userDisplayName: presentationMock.ownerDisplayName,
                    userId: presentationMock.ownerIdentifier,
                });
            } catch (error) {
                expect(error).toStrictEqual(maxRetryError);
            }
        });

        it("Throw error when generating multiple choice options", async () => {
            const invalidMultipleChoiceOptionsErrorMessage = "Default option count must greater than 0";
            const invalidMultipleChoiceOptionsError = new Error(invalidMultipleChoiceOptionsErrorMessage);

            jest.spyOn(service, "createPresentationWithDefaultSlideAsync").mockImplementation(() => {
                throw invalidMultipleChoiceOptionsError;
            });

            const dataToCreate = {
                presentationName: presentationMock.name,
                userDisplayName: presentationMock.ownerDisplayName,
                userId: presentationMock.ownerIdentifier,
            };

            expect(() => service.createPresentationWithDefaultSlideAsync(dataToCreate)).toThrow();
            expect(() => service.createPresentationWithDefaultSlideAsync(dataToCreate)).toThrow(Error);
            expect(() => service.createPresentationWithDefaultSlideAsync(dataToCreate)).toThrow(
                invalidMultipleChoiceOptionsErrorMessage,
            );
            expect(() => service.createPresentationWithDefaultSlideAsync(dataToCreate)).toThrow(
                invalidMultipleChoiceOptionsError,
            );

            try {
                await service.createPresentationWithDefaultSlideAsync({
                    presentationName: presentationMock.name,
                    userDisplayName: presentationMock.ownerDisplayName,
                    userId: presentationMock.ownerIdentifier,
                });
            } catch (error) {
                expect(error).toStrictEqual(invalidMultipleChoiceOptionsError);
            }
        });
    });
});
