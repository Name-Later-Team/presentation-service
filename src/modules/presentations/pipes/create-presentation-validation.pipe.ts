import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { CreatePresentationDto } from "src/core/dtos";

const createPresentationValidationSchema = Joi.object<CreatePresentationDto>({
    name: Joi.string().required().trim().max(100).messages({
        "any.required": "Tên bài trình bày không được bỏ trống",
        "string.base": "Tên bài trình bày phải là chuỗi",
        "string.empty": "Tên bài trình bày không được bỏ trống",
        "string.max": "Tên bài trình bày không được quá 100 ký tự",
    }),
}).options({ allowUnknown: true, stripUnknown: true });

@Injectable()
export class CreatePresentationValidationPipe implements PipeTransform<any, CreatePresentationDto> {
    transform(body: any, metadata: ArgumentMetadata): CreatePresentationDto {
        const result = createPresentationValidationSchema.validate(body, { convert: true });
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
