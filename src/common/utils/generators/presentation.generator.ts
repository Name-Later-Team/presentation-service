import { PresentationPace, SlideChoice } from "src/core/entities";

function generatePresentationPace(): PresentationPace {
    return {
        mode: "presenter",
        active_slide_id: 0,
        state: "idle",
        counter: 0,
    };
}

function generateVotingCode(codeLength: number): string {
    if (codeLength < 0) {
        throw new Error("Voting code length must greater than 0");
    }

    const base = Math.pow(10, codeLength - 1);
    const number = Math.floor(Math.random() * base);

    return number < base ? `0${number}` : number.toString();
}

function generateMultipleChoiceOptions(optionCount: number, slideId: number): Partial<SlideChoice>[] {
    if (optionCount < 0) {
        throw new Error("Default option count must greater than 0");
    }
    const optionList: Partial<SlideChoice>[] = [];

    for (let i = 0; i < optionCount; i++) {
        const option: Partial<SlideChoice> = {
            label: `Lựa chọn ${i + 1}`,
            position: i,
            isCorrectAnswer: false,
            slideId,
            type: "option",
        };

        optionList.push(option);
    }

    return optionList;
}

export const PresentationGenerator = {
    generatePresentationPace,
    generateVotingCode,
    generateMultipleChoiceOptions,
};
