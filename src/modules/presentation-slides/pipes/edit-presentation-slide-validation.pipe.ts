import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { PresentationSlideTypeEnum } from "src/core/types";
import { EditPresentationSlideChoiceDto, EditPresentationSlideDto } from "src/core/dtos";

const editPresentationSlideChoiceDto = Joi.object<EditPresentationSlideChoiceDto>({
    id: Joi.number().integer().greater(-1).required().messages({
        "any.required": "Mã định danh câu trả lời không tồn tại",
        "number.base": "Mã định danh câu trả lời không hợp lệ",
        "number.greater": "Mã định danh câu trả lời không hợp lệ",
    }),
    label: Joi.string().allow("").max(150).required().messages({
        "any.required": "Nội dung câu trả lời không được bỏ trống",
        "string.base": "Nội dung câu trả lời phải là chuỗi",
        "string.max": "Nội dung câu trả lời không được vượt quá 150 ký tự",
        "string.ref": "Nội dung câu trả lời không được vượt quá 150 ký tự",
    }),
    position: Joi.number().integer().greater(-1).required().messages({
        "any.required": "Thứ tự câu trả lời không tồn tại",
        "number.base": "Thứ tự câu trả lời không hợp lệ",
        "number.greater": "Thứ tự câu trả lời không hợp lệ",
    }),
    type: Joi.string().allow("").max(40).required().messages({
        "any.required": "Loại câu trả lời không được bỏ trống",
        "string.base": "Loại câu trả lời phải là chuỗi",
        "string.max": "Loại câu trả lời không được vượt quá 40 ký tự",
        "string.ref": "Loại câu trả lời không được vượt quá 40 ký tự",
    }),
    isCorrectAnswer: Joi.boolean().required().messages({
        "any.required": "Trạng thái đúng/sai của câu trả lời là bắt buộc",
        "boolean.base": "Trạng thái đúng/sai của câu trả lời không hợp lệ",
    }),
    metadata: Joi.string().allow("", null).required().messages({
        "any.required": "Dữ liệu cập nhật không hợp lệ",
        "string.base": "Dữ liệu cập nhật không hợp lệ",
    }),
});

const editPresentationValidationSlideSchema = Joi.object<EditPresentationSlideDto>({
    presentationId: Joi.number().integer().greater(0).required().messages({
        "any.required": "Mã định danh bài trình bày là bắt buộc",
        "number.base": "Mã định danh bài trình bày không hợp lệ",
        "number.greater": "Mã định danh bài trình bày không hợp lệ",
        "number.infinity": "Mã định danh bài trình bày không hợp lệ",
    }),
    presentationIdentifier: Joi.string()
        .guid({ version: ["uuidv4"] })
        .required()
        .messages({
            "any.required": "Mã định danh bài trình bày là bắt buộc",
            "string.base": "Mã định danh bài trình bày không hợp lệ",
            "string.empty": "Mã định danh bài trình bày không hợp lệ",
            "string.guid": "Mã định danh bài trình bày không hợp lệ",
        }),
    question: Joi.string().allow("").max(120).required().messages({
        "any.required": "Tên câu hỏi/tiêu đề không được bỏ trống",
        "string.base": "Tên câu hỏi/tiêu đề phải là chuỗi",
        "string.max": "Tên câu hỏi/tiêu đề không được vượt quá 120 ký tự",
        "string.ref": "Tên câu hỏi/tiêu đề không được vượt quá 120 ký tự",
    }),
    questionDescription: Joi.string().allow("", null).max(250).required().messages({
        "any.required": "Mô tả không được bỏ trống",
        "string.base": "Mô tả phải là chuỗi",
        "string.max": "Mô tả không được vượt quá 250 ký tự",
        "string.ref": "Mô tả không được vượt quá 250 ký tự",
    }),
    questionImageUrl: Joi.string().allow(null).required().messages({
        "any.required": "Dữ liệu cập nhật không hợp lệ",
        "string.base": "Đường dẫn hình ảnh phải là chuỗi",
        "string.empty": "Đường dẫn hình ảnh không hợp lệ",
    }),
    questionVideoEmbedUrl: Joi.string().allow(null).required().messages({
        "any.required": "Dữ liệu cập nhật không hợp lệ",
        "string.base": "Đường dẫn video phải là chuỗi",
        "string.empty": "Đường dẫn video không hợp lệ",
    }),
    slideType: Joi.string()
        .required()
        .trim()
        .valid(...Object.values(PresentationSlideTypeEnum))
        .messages({
            "any.required": "Loại trang trình chiếu không được bỏ trống",
            "string.base": "Loại trang trình chiếu phải là chuỗi",
            "string.empty": "Loại trang trình chiếu không được bỏ trống",
            "any.only": "Loại trang trình chiếu không hợp lệ",
        }),
    speakerNotes: Joi.string().allow("", null).required().messages({
        "any.required": "Dữ liệu cập nhật không hợp lệ",
        "string.base": "Ghi chú phải là chuỗi",
    }),
    isActive: Joi.boolean().required().messages({
        "any.required": "Trạng thái bình chọn là bắt buộc",
        "boolean.base": "Trạng thái bình chọn không hợp lệ",
    }),
    showResult: Joi.boolean().required().messages({
        "any.required": "Trạng thái hướng dẫn vào trang bình chọn là bắt buộc",
        "boolean.base": "Trạng thái hướng dẫn vào trang bình chọn không hợp lệ",
    }),
    hideInstructionBar: Joi.boolean().required().messages({
        "any.required": "Trạng thái ẩn thanh hướng dẫn vào trang bình chọn là bắt buộc",
        "boolean.base": "Trạng thái ẩn thanh hướng dẫn vào trang bình chọn không hợp lệ",
    }),
    extrasConfig: Joi.alternatives([
        Joi.object().allow(null).messages({
            "object.base": "Cấu hình riêng cho loại trang trình chiếu không hợp lệ",
        }),
        Joi.string().allow(null).messages({
            "string.base": "Cấu hình riêng cho loại trang trình chiếu không hợp lệ",
        }),
    ])
        .required()
        .messages({
            "any.required": "Dữ liệu cập nhật không hợp lệ",
        }),
    position: Joi.number().integer().greater(-1).required().messages({
        "any.required": "Thứ tự trang trình chiếu không tồn tại",
        "number.base": "Thứ tự trang trình chiếu không hợp lệ",
        "number.greater": "Thứ tự trang trình chiếu không hợp lệ",
    }),
    textSize: Joi.number().integer().greater(0).required().messages({
        "any.required": "Kích cỡ chữ của trang trình chiếu là bắt buộc",
        "number.base": "Kích cỡ chữ của trang trình chiếu phải là giá trị số",
        "number.greater": "Kích cỡ chữ của trang trình chiếu không hợp lệ",
    }),
    choices: Joi.array().items(editPresentationSlideChoiceDto).required().messages({
        "any.required": "Kích cỡ chữ của trang trình chiếu là bắt buộc",
    }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class EditPresentationSlideValidationPipe implements PipeTransform<any, EditPresentationSlideDto> {
    transform(body: any, metadata: ArgumentMetadata): EditPresentationSlideDto {
        const result = editPresentationValidationSlideSchema.validate(body, { convert: true });
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
