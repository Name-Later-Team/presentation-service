import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { FindOnePresentationByCodeDto } from "src/core/dtos";

const findOnePresentationByCodeValidationSchema = Joi.object<FindOnePresentationByCodeDto>({
    code: Joi.string().required().messages({
        "any.required": "Mã định danh bài trình bày là bắt buộc",
        "string.base": "Mã định danh bài trình bày không hợp lệ",
        "string.empty": "Mã định danh bài trình bày không hợp lệ",
    }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class FindOnePresentationByCodeValidationPipe implements PipeTransform<any, FindOnePresentationByCodeDto> {
    transform(query: any, metadata: ArgumentMetadata): FindOnePresentationByCodeDto {
        const result = findOnePresentationByCodeValidationSchema.validate(query, { convert: true });
        if (result.error) {
            const {
                error: { message, details },
            } = result;
            throw new RequestValidationException(message, details);
        }

        return result.value;
    }
}
