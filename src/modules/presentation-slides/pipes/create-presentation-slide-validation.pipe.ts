import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { PresentationSlideTypeEnum } from "src/common/types";
import { CreatePresentationSlideDto } from "src/core/dtos";

const createPresentationValidationSlideSchema = Joi.object({
    type: Joi.string()
        .required()
        .trim()
        .valid(...Object.values(PresentationSlideTypeEnum))
        .messages({
            "any.required": "Loại trang trình chiếu không được bỏ trống",
            "string.base": "Loại trang trình chiếu phải là chuỗi",
            "string.empty": "Loại trang trình chiếu không được bỏ trống",
            "any.only": "Loại trang trình chiếu không hợp lệ",
        }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class CreatePresentationSlideValidationPipe implements PipeTransform<any, CreatePresentationSlideDto> {
    transform(body: any, metadata: ArgumentMetadata): CreatePresentationSlideDto {
        const result = createPresentationValidationSlideSchema.validate(body, { convert: true });
        if (result.error) {
            const {
                error: { message, details },
            } = result;
            throw new RequestValidationException(message, details);
        }

        const { value } = result;
        return value;
    }
}
