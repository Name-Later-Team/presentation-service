import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { EditPresentationDto } from "src/core/dtos";

const editPresentationValidationSchema = Joi.object<EditPresentationDto>({
    name: Joi.string().trim().max(100).messages({
        // "any.required": "Tên bài trình bày không được bỏ trống",
        "string.base": "Tên bài trình bày phải là chuỗi",
        "string.empty": "Tên bài trình bày không được bỏ trống",
        "string.max": "Tên bài trình bày không được quá 100 ký tự",
    }),
    closedForVoting: Joi.boolean().messages({
        "boolean.base": "Cho phép bầu chọn phải là boolean",
    }),
    slides: Joi.array()
        .items(
            Joi.object<{ id: number; position: number }>({
                id: Joi.number().integer().greater(0).required().messages({
                    "any.required": "Mã định danh trang trình chiếu là bắt buộc",
                    "number.base": "Mã định danh trang trình chiếu không hợp lệ",
                    "number.greater": "Mã định danh trang trình chiếu không hợp lệ",
                    "number.infinity": "Mã định danh trang trình chiếu không hợp lệ",
                }),
                position: Joi.number().integer().greater(-1).required().messages({
                    "any.required": "Thứ tự trang trình chiếu không tồn tại",
                    "number.base": "Thứ tự trang trình chiếu không hợp lệ",
                    "number.greater": "Thứ tự trang trình chiếu không hợp lệ",
                }),
            }),
        )
        .min(1)
        .messages({
            "array.base": "Danh sách trang trình chiếu không hợp lệ",
            "array.length": "Bài trình bày ít nhất phải có một trang chiếu",
            "array.ref": "Bài trình bày ít nhất phải có một trang chiếu",
        }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class EditPresentationValidationPipe implements PipeTransform<any, EditPresentationDto> {
    transform(body: any, metadata: ArgumentMetadata): EditPresentationDto {
        const result = editPresentationValidationSchema.validate(body, { convert: true });
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
