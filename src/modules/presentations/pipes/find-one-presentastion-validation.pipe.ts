import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { FindOnePresentationDto } from "src/core/dtos";

const findOnePresentationValidationSchema = Joi.object<FindOnePresentationDto>({
    identifier: Joi.alternatives([
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
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class FindOnePresentationValidationPipe implements PipeTransform<any, FindOnePresentationDto> {
    transform(query: any, metadata: ArgumentMetadata): FindOnePresentationDto {
        const result = findOnePresentationValidationSchema.validate(query, { convert: true });
        if (result.error) {
            const {
                error: { message, details },
            } = result;
            throw new RequestValidationException(message, details);
        }

        return result.value;
    }
}
