import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { EditBasicInfoPresentationDto } from "src/core/dtos";

const editBasicInfoPresentationValidationSchema = Joi.object<EditBasicInfoPresentationDto>({
    id: Joi.number().required().messages({
        "any.required": "ID bài trình bày không được bỏ trống",
        "number.base": "ID bài trình bày phải là số",
    }),
    name: Joi.string().required().trim().max(100).messages({
        "any.required": "Tên bài trình bày không được bỏ trống",
        "string.base": "Tên bài trình bày phải là chuỗi",
        "string.empty": "Tên bài trình bày không được bỏ trống",
        "string.max": "Tên bài trình bày không được quá 100 ký tự",
    }),
    closedForVoting: Joi.boolean().messages({
        "boolean.base": "Closed for voting bài trình bày phải là boolean",
    }),
}).options({ allowUnknown: true, stripUnknown: true });

@Injectable()
export class editBasicInfoPresentationValidationPipe implements PipeTransform<any, EditBasicInfoPresentationDto> {
    transform(body: any, metadata: ArgumentMetadata): EditBasicInfoPresentationDto {
        const result = editBasicInfoPresentationValidationSchema.validate(body, { convert: true });
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
