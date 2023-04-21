import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { FindOnePresentationSlideQueryDto } from "src/core/dtos";

const findOnePresentationSlideValidationSchema = Joi.object<FindOnePresentationSlideQueryDto>({
    includeResults: Joi.boolean().messages({
        "boolean.base": "Yêu cầu không hợp lệ",
    }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class FindOnePresentationSlideQueryValidationPipe
    implements PipeTransform<any, FindOnePresentationSlideQueryDto>
{
    transform(query: any, metadata: ArgumentMetadata): FindOnePresentationSlideQueryDto {
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
