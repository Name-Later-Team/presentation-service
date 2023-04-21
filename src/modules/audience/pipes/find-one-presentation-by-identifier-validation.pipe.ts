import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as Joi from "joi";
import { RequestValidationException } from "src/common/exceptions";
import { AudienceFindOnePresentationByIdentifierDto } from "src/core/dtos";

const findOnePresentationByIdentifierValidationSchema = Joi.object<AudienceFindOnePresentationByIdentifierDto>({
    presentationIdentifier: Joi.string()
        .guid({ version: ["uuidv4"] })
        .required()
        .messages({
            "any.required": "Mã định danh bài trình bày là bắt buộc",
            "string.base": "Mã định danh bài trình bày không hợp lệ",
            "string.empty": "Mã định danh bài trình bày không hợp lệ",
            "string.guid": "Mã định danh bài trình bày không hợp lệ",
        }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

@Injectable()
export class FindOnePresentationByIdentifierValidationPipe
    implements PipeTransform<any, AudienceFindOnePresentationByIdentifierDto>
{
    transform(query: any, metadata: ArgumentMetadata): AudienceFindOnePresentationByIdentifierDto {
        const result = findOnePresentationByIdentifierValidationSchema.validate(query, { convert: true });
        if (result.error) {
            const {
                error: { message, details },
            } = result;
            throw new RequestValidationException(message, details);
        }

        return result.value;
    }
}
