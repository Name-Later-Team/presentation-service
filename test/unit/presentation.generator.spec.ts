import { PresentationGenerator } from "src/common/utils/generators";
import { SlideChoice } from "src/core/entities";

describe("Presentation Generator", () => {
    it("Generate presentation pace", () => {
        const pace = PresentationGenerator.generatePresentationPace();
        expect(pace).toEqual({
            mode: "presenter",
            active_slide_id: 0,
            state: "idle",
            counter: 0,
        });
    });

    it("Generate voting code with correct length", () => {
        expect(PresentationGenerator.generateVotingCode(5)).toHaveLength(5);
    });

    it("Generate voting code with incorrect length", () => {
        const mockGenerateVotingCode = jest.fn(PresentationGenerator.generateVotingCode).mockReturnValue("123");
        const code = mockGenerateVotingCode(5);

        expect(code).toBe("123");
        expect(code).toHaveLength(3);
        expect(mockGenerateVotingCode).toHaveBeenCalled();
        expect(mockGenerateVotingCode).toHaveBeenCalledTimes(1);
        expect(mockGenerateVotingCode).toBeCalledWith(5);
    });

    it("Generate voting code with throwing error (length < 0)", () => {
        const invalidCodeLengthErrorMessage = "Voting code length must greater than 0";
        const invalidCodeLengthError = new Error(invalidCodeLengthErrorMessage);

        expect(() => PresentationGenerator.generateVotingCode(-1)).toThrow();
        expect(() => PresentationGenerator.generateVotingCode(-1)).toThrow(Error);
        expect(() => PresentationGenerator.generateVotingCode(-1)).toThrow(invalidCodeLengthErrorMessage);
        expect(() => PresentationGenerator.generateVotingCode(-1)).toThrow(invalidCodeLengthError);
    });

    it("Generate multiple choice options", () => {
        const optionCount = 2;
        const slideId = 1;
        const choices: Partial<SlideChoice>[] = [];
        for (let i = 0; i < optionCount; i++) {
            choices.push({
                label: `Lựa chọn ${i + 1}`,
                position: i,
                isCorrectAnswer: false,
                slideId,
                type: "option",
            });
        }

        expect(PresentationGenerator.generateMultipleChoiceOptions(optionCount, slideId)).toEqual(choices);
    });

    it("Generate multiple choice options with throwing error", () => {
        const invalidMultipleChoiceOptionsErrorMessage = "Default option count must greater than 0";
        const invalidMultipleChoiceOptionsError = new Error(invalidMultipleChoiceOptionsErrorMessage);

        expect(() => PresentationGenerator.generateMultipleChoiceOptions(-1, 1)).toThrow();
        expect(() => PresentationGenerator.generateMultipleChoiceOptions(-1, 1)).toThrow(Error);
        expect(() => PresentationGenerator.generateMultipleChoiceOptions(-1, 1)).toThrow(
            invalidMultipleChoiceOptionsErrorMessage,
        );
        expect(() => PresentationGenerator.generateMultipleChoiceOptions(-1, 1)).toThrow(
            invalidMultipleChoiceOptionsError,
        );
    });
});
