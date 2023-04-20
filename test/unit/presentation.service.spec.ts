import { Test } from "@nestjs/testing";
import * as moment from "moment";
import { VOTING_CODE_GENERATION_RETRY_ATTEMPTS } from "src/common/constants";
import { PresentationGenerator } from "src/common/utils/generators";
import { PRESENTATION_ACTION_PUB_TOKEN } from "src/infrastructure/brokers/publishers";
import {
    PRESENTATION_REPO_TOKEN,
    PRESENTATION_SLIDE_REPO_TOKEN,
    PRESENTATION_VOTING_CODE_REPO_TOKEN,
    SLIDE_CHOICE_REPO_TOKEN,
    SLIDE_VOTING_RESULT_REPO_TOKEN,
} from "src/infrastructure/repositories";
import {
    IPresentationRepository,
    IPresentationSlideRepository,
    IPresentationVotingCodeRepository,
    ISlideChoiceRepository,
} from "src/infrastructure/repositories/interfaces";
import { PresentationService } from "src/infrastructure/services";

const generateMockData = () => {
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
    const votingCodeMock = {
        id: 1,
        presentationIdentifier: presentationMock.identifier,
        code: "12345678",
        isValid: true,
        expiresAt: moment().add(2, "days").toDate(),
    };
    const slideMock = {
        id: 13,
        presentationId: 5,
        presentationIdentifier: "3739d434-4d89-4a5d-b4dd-3c9401431044",
        question: "Default question",
        questionDescription: "",
        questionImageUrl: null,
        questionVideoEmbedUrl: null,
        slideType: "multiple_choice",
        speakerNotes: null,
        isActive: true,
        showResult: true,
        hideInstructionBar: false,
        extrasConfig: null,
        position: 0,
        createdAt: new Date(), //2023-04-18 17:58:25.095205+00,
        updatedAt: new Date(), //2023-04-18 17:58:25.095205+00,
        textSize: 32,
        sessionNo: 1,
    };

    const defaultPaceMock = PresentationGenerator.generatePresentationPace();
    const defaultOptionListMock = PresentationGenerator.generateMultipleChoiceOptions(1, slideMock.id);

    return { presentationMock, votingCodeMock, slideMock, defaultPaceMock, defaultOptionListMock };
};

describe("Presentation Service", () => {
    let service: PresentationService;
    let presentationRepositoryMock: IPresentationRepository;
    let presentationVotingCodeRepositoryMock: IPresentationVotingCodeRepository;
    let presentationSlideRepositoryMock: IPresentationSlideRepository;
    let slideChoiceRepositoryMock: ISlideChoiceRepository;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PresentationService,
                {
                    provide: PRESENTATION_REPO_TOKEN,
                    useValue: {
                        saveRecordAsync: jest.fn(),
                        updateRecordByIdAsync: jest.fn(),
                    },
                },
                {
                    provide: PRESENTATION_VOTING_CODE_REPO_TOKEN,
                    useValue: {
                        saveRecordAsync: jest.fn(),
                        existsPresentationVotingCodeAsync: jest.fn(),
                    },
                },
                {
                    provide: PRESENTATION_SLIDE_REPO_TOKEN,
                    useValue: {
                        saveRecordAsync: jest.fn(),
                    },
                },
                {
                    provide: SLIDE_CHOICE_REPO_TOKEN,
                    useValue: {
                        saveManyRecordAsync: jest.fn(),
                    },
                },
                {
                    provide: SLIDE_VOTING_RESULT_REPO_TOKEN,
                    useFactory: jest.fn(),
                },
                {
                    provide: PRESENTATION_ACTION_PUB_TOKEN,
                    useFactory: jest.fn(),
                },
            ],
        }).compile();

        service = module.get<PresentationService>(PresentationService);
        presentationRepositoryMock = module.get(PRESENTATION_REPO_TOKEN);
        presentationVotingCodeRepositoryMock = module.get(PRESENTATION_VOTING_CODE_REPO_TOKEN);
        presentationSlideRepositoryMock = module.get(PRESENTATION_SLIDE_REPO_TOKEN);
        slideChoiceRepositoryMock = module.get(SLIDE_CHOICE_REPO_TOKEN);
    });

    describe("createPresentationWithDefaultSlideAsync method", () => {
        const { presentationMock, votingCodeMock, slideMock, defaultPaceMock, defaultOptionListMock } =
            generateMockData();

        it("Created", async () => {
            jest.spyOn(presentationRepositoryMock, "saveRecordAsync").mockImplementationOnce((_) =>
                Promise.resolve({ ...presentationMock, pace: defaultPaceMock, totalSlides: 0 }),
            );
            jest.spyOn(service, "generateVotingCodeWithCheckingDuplicateAsync").mockImplementationOnce((_) =>
                Promise.resolve(votingCodeMock.code),
            );
            jest.spyOn(presentationVotingCodeRepositoryMock, "saveRecordAsync").mockImplementationOnce((_) =>
                Promise.resolve(votingCodeMock),
            );
            jest.spyOn(presentationSlideRepositoryMock, "saveRecordAsync").mockImplementationOnce((_) =>
                Promise.resolve(slideMock),
            );
            jest.spyOn(presentationRepositoryMock, "updateRecordByIdAsync").mockImplementationOnce((_) =>
                Promise.resolve({ raw: "", affected: 0, generatedMaps: [] }),
            );
            jest.spyOn(slideChoiceRepositoryMock, "saveManyRecordAsync").mockImplementationOnce((_) =>
                Promise.resolve({ identifiers: [], generatedMaps: [], raw: "" }),
            );

            const result = await service.createPresentationWithDefaultSlideAsync({
                presentationName: presentationMock.name,
                userDisplayName: presentationMock.ownerDisplayName,
                userId: presentationMock.ownerIdentifier,
            });

            expect(result).toBe(presentationMock.identifier);

            expect(presentationRepositoryMock.saveRecordAsync).toHaveBeenCalledWith({
                name: presentationMock.name,
                ownerIdentifier: presentationMock.ownerIdentifier,
                ownerDisplayName: presentationMock.ownerDisplayName,
                pace: defaultPaceMock,
                totalSlides: 0,
            });
            expect(presentationRepositoryMock.saveRecordAsync).toHaveReturnedWith(Promise.resolve(presentationMock));

            expect(service.generateVotingCodeWithCheckingDuplicateAsync).toHaveBeenCalledWith(8);
            expect(service.generateVotingCodeWithCheckingDuplicateAsync).toHaveReturnedWith(
                Promise.resolve(votingCodeMock.code),
            );

            // expect(presentationVotingCodeRepositoryMock.saveRecordAsync).toHaveBeenCalledWith({
            //     code: votingCodeMock.code,
            //     presentationIdentifier: presentationMock.identifier,
            //     isValid: true,
            //     expiresAt: votingCodeMock.expiresAt,
            // });
            expect(presentationVotingCodeRepositoryMock.saveRecordAsync).toHaveReturnedWith(
                Promise.resolve(votingCodeMock),
            );

            expect(presentationSlideRepositoryMock.saveRecordAsync).toHaveBeenCalledWith({
                presentationId: presentationMock.id,
                presentationIdentifier: presentationMock.identifier,
                question: slideMock.question,
                slideType: slideMock.slideType,
                position: 0,
            });
            expect(presentationSlideRepositoryMock.saveRecordAsync).toHaveReturnedWith(Promise.resolve(slideMock));

            expect(presentationRepositoryMock.updateRecordByIdAsync).toHaveBeenCalledWith(presentationMock.id, {
                totalSlides: presentationMock.totalSlides,
                pace: presentationMock.pace,
            });
            expect(presentationRepositoryMock.updateRecordByIdAsync).toHaveReturnedWith(
                Promise.resolve({ raw: "", affected: 0, generatedMaps: [] }),
            );

            expect(slideChoiceRepositoryMock.saveManyRecordAsync).toHaveBeenCalledWith(defaultOptionListMock);
            expect(slideChoiceRepositoryMock.saveManyRecordAsync).toHaveReturnedWith(
                Promise.resolve({ identifiers: [], generatedMaps: [], raw: "" }),
            );
        });

        it("Throw error at generateVotingCodeWithCheckingDuplicateAsync method", async () => {
            jest.spyOn(presentationRepositoryMock, "saveRecordAsync").mockImplementationOnce((_) =>
                Promise.resolve({ ...presentationMock, pace: defaultPaceMock, totalSlides: 0 }),
            );
            jest.spyOn(PresentationGenerator, "generateVotingCode").mockImplementation(() => "12345678");
            jest.spyOn(presentationVotingCodeRepositoryMock, "existsPresentationVotingCodeAsync").mockImplementation(
                (_) => Promise.resolve(true),
            );

            const maxRetryErrorMessage = `Max retry count (1 + ${VOTING_CODE_GENERATION_RETRY_ATTEMPTS} retry) for regenerating voting code`;
            const maxRetryError = new Error(maxRetryErrorMessage);

            expect(() => service.generateVotingCodeWithCheckingDuplicateAsync(8)).rejects.toThrow();
            expect(() => service.generateVotingCodeWithCheckingDuplicateAsync(8)).rejects.toThrow(Error);
            expect(() => service.generateVotingCodeWithCheckingDuplicateAsync(8)).rejects.toThrow(maxRetryErrorMessage);
            expect(() => service.generateVotingCodeWithCheckingDuplicateAsync(8)).rejects.toThrow(maxRetryError);

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

        it("Throw error at generateMultipleChoiceOptions function", async () => {
            jest.spyOn(presentationRepositoryMock, "saveRecordAsync").mockImplementationOnce((_) =>
                Promise.resolve({ ...presentationMock, pace: defaultPaceMock, totalSlides: 0 }),
            );
            jest.spyOn(service, "generateVotingCodeWithCheckingDuplicateAsync").mockImplementationOnce((_) =>
                Promise.resolve(votingCodeMock.code),
            );
            jest.spyOn(presentationVotingCodeRepositoryMock, "saveRecordAsync").mockImplementationOnce((_) =>
                Promise.resolve(votingCodeMock),
            );
            jest.spyOn(presentationSlideRepositoryMock, "saveRecordAsync").mockImplementationOnce((_) =>
                Promise.resolve(slideMock),
            );
            jest.spyOn(presentationRepositoryMock, "updateRecordByIdAsync").mockImplementationOnce((_) =>
                Promise.resolve({ raw: "", affected: 0, generatedMaps: [] }),
            );

            const invalidMultipleChoiceOptionsErrorMessage = "Default option count must greater than 0";
            const invalidMultipleChoiceOptionsError = new Error(invalidMultipleChoiceOptionsErrorMessage);

            jest.spyOn(PresentationGenerator, "generateMultipleChoiceOptions").mockImplementation(() => {
                throw invalidMultipleChoiceOptionsError;
            });

            expect(() => PresentationGenerator.generateMultipleChoiceOptions(-1, 1)).toThrow();
            expect(() => PresentationGenerator.generateMultipleChoiceOptions(-1, 1)).toThrow(Error);
            expect(() => PresentationGenerator.generateMultipleChoiceOptions(-1, 1)).toThrow(
                invalidMultipleChoiceOptionsErrorMessage,
            );
            expect(() => PresentationGenerator.generateMultipleChoiceOptions(-1, 1)).toThrow(
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
