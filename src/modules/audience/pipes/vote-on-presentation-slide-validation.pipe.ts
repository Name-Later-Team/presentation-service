import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { AudienceVoteOnPresentationSlideDto } from "src/core/dtos";
import { VotingAnswerTypeEnum } from "src/core/types";

const voteOnPresentationSlideValidationSchema = Joi.object<AudienceVoteOnPresentationSlideDto>({
    userId: Joi.string().required().messages({
        "any.required": "Mã định danh người tham gia là bắt buộc",
        "string.base": "Mã định danh người tham gia không hợp lệ",
        "string.empty": "Mã định danh người tham gia không hợp lệ",
    }),
    choiceIds: Joi.array()
        .items(
            Joi.number().integer().greater(0).messages({
                "number.base": "Mã định danh câu trả lời không hợp lệ",
                "number.greater": "Mã định danh câu trả lời không hợp lệ",
                "number.infinity": "Mã định danh câu trả lời không hợp lệ",
            }),
        )
        .min(1)
        .required()
        .messages({
            "any.required": "Bạn phải chọn ít nhất một câu trả lời",
        }),
    // type: Joi.string()
    //     .valid(...Object.values(VotingAnswerTypeEnum))
    //     .required()
    //     .messages({
    //         "any.required": "Loại câu trả lời là bắt buộc",
    //         "any.only": "Loại câu trả lời không hợp lệ",
    //         "string.base": "Loại câu trả lời không hợp lệ",
    //         "string.empty": "Loại câu trả lời là bắt buộc",
    //     }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class VoteOnPresentationSlideValidationPipe implements PipeTransform<any, AudienceVoteOnPresentationSlideDto> {
    transform(query: any, metadata: ArgumentMetadata): AudienceVoteOnPresentationSlideDto {
        const result = voteOnPresentationSlideValidationSchema.validate(query, { convert: true });
        if (result.error) {
            const {
                error: { message, details },
            } = result;
            throw new RequestValidationException(message, details);
        }

        return result.value;
    }
}
