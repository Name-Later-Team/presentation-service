import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { PAGINATION } from "src/common/constants";
import { RequestValidationException } from "src/common/exceptions";
import { FindAllPresentationsDto } from "src/core/dtos";

const findAllPresentationsValidationSchema = Joi.object<FindAllPresentationsDto>({
    // prettier-ignore
    page: Joi.number()
        .integer()
        .min(1)
        .optional()
        .default(PAGINATION.DEFAULT_PAGE)
            .messages({
            "number.base": "Số trang không hợp lệ",
            "number.infinity": "Số trang không hợp lệ",
            "number.min": "Số trang không thể nhỏ hơn 1",
        }),

    limit: Joi.number()
        .integer()
        .min(0)
        .max(PAGINATION.MAX_PAGE_SIZE)
        .optional()
        .default(PAGINATION.DEFAULT_PAGE_SIZE)
        .messages({
            "number.base": "Số lượng bài trình bày tối đa không hợp lệ",
            "number.infinity": "Số lượng bài trình bày tối đa không hợp lệ",
            "number.min": "Số lượng bài trình bày không thể ít hơn 0",
            "number.max": `Số lượng bài trình bày không thể nhiều hơn ${PAGINATION.MAX_PAGE_SIZE}`,
        }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class FindAllPresentationsValidationPipe implements PipeTransform<any, FindAllPresentationsDto> {
    transform(query: any, metadata: ArgumentMetadata): FindAllPresentationsDto {
        const result = findAllPresentationsValidationSchema.validate(query, { convert: true });
        if (result.error) {
            const {
                error: { message, details },
            } = result;
            throw new RequestValidationException(message, details);
        }

        return result.value;
    }
}
