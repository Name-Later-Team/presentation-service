import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { FindOnePresentationSlideDto } from "src/core/dtos";

const findOnePresentationSlideValidationSchema = Joi.object<FindOnePresentationSlideDto>({
    presentationIdentifier: Joi.alternatives([
        // prettier-ignore
        Joi.number()
            .integer()
            .greater(0)
            .messages({
                "number.base": "Mã định danh bài trình bày không hợp lệ",
                "number.greater": "Mã định danh bài trình bày không hợp lệ",
                "number.infinity": "Mã định danh bài trình bày không hợp lệ",
            }),
        Joi.string()
            .guid({ version: ["uuidv4"] })
            .messages({
                "string.base": "Mã định danh bài trình bày không hợp lệ",
                "string.empty": "Mã định danh bài trình bày không hợp lệ",
                "string.guid": "Mã định danh bài trình bày không hợp lệ",
            }),
    ])
        .required()
        .messages({
            "any.required": "Mã định danh bài trình bày là bắt buộc",
        }),
    slideId: Joi.number().integer().greater(0).required().messages({
        "any.required": "Mã định danh trang trình chiếu là bắt buộc",
        "number.base": "Mã định danh trang trình chiếu không hợp lệ",
        "number.greater": "Mã định danh trang trình chiếu không hợp lệ",
        "number.infinity": "Mã định danh trang trình chiếu không hợp lệ",
    }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class FindOnePresentationSlideValidationPipe implements PipeTransform<any, FindOnePresentationSlideDto> {
    transform(query: any, metadata: ArgumentMetadata): FindOnePresentationSlideDto {
        const result = findOnePresentationSlideValidationSchema.validate(query, { convert: true });
        if (result.error) {
            const {
                error: { message, details },
            } = result;
            throw new RequestValidationException(message, details);
        }

        return result.value;
    }
}
