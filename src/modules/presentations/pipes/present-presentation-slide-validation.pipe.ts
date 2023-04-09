import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { PresentPresentationActionEnum } from "src/common/types";
import { PresentPresentationSlideDto } from "src/core/dtos";

const presentPresentationSlideValidationSchema = Joi.object<PresentPresentationSlideDto>({
    slideId: Joi.number().integer().greater(0).allow(null).required().messages({
        "any.required": "Mã định danh trang trình chiếu là bắt buộc",
        "number.base": "Mã định danh trang trình chiếu không hợp lệ",
        "number.greater": "Mã định danh trang trình chiếu không hợp lệ",
        "number.infinity": "Mã định danh trang trình chiếu không hợp lệ",
    }),
    action: Joi.string()
        .required()
        .trim()
        .valid(...Object.values(PresentPresentationActionEnum))
        .messages({
            "any.required": "Hành động không hợp lệ",
            "string.base": "Hành động không hợp lệ",
            "string.empty": "Hành động không hợp lệ",
            "any.only": "Hành động không hợp lệ",
        }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class PresentPresentationSlideValidationPipe implements PipeTransform<any, PresentPresentationSlideDto> {
    transform(query: any, metadata: ArgumentMetadata): PresentPresentationSlideDto {
        const result = presentPresentationSlideValidationSchema.validate(query, { convert: true });
        if (result.error) {
            const {
                error: { message, details },
            } = result;
            throw new RequestValidationException(message, details);
        }

        return result.value;
    }
}
