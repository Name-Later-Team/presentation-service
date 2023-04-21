import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { AudienceFindOnePresentationByCodeDto } from "src/core/dtos";

const findOnePresentationByCodeValidationSchema = Joi.object<AudienceFindOnePresentationByCodeDto>({
    code: Joi.string().required().messages({
        "any.required": "Mã tham gia bài trình bày là bắt buộc",
        "string.base": "Mã tham gia bài trình bày không hợp lệ",
        "string.empty": "Mã tham gia bài trình bày không hợp lệ",
    }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class FindOnePresentationByCodeValidationPipe
    implements PipeTransform<any, AudienceFindOnePresentationByCodeDto>
{
    transform(query: any, metadata: ArgumentMetadata): AudienceFindOnePresentationByCodeDto {
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
