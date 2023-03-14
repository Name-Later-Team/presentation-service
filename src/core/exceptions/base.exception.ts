export abstract class BaseException extends Error {
    /**
     *
     * @param status HTTP status code
     * @param message Developer readable message
     * @param code Error identifier
     * @param response Response in data field
     */
    constructor(
        public status: number,
        message: string,
        public code: number,
        public response?: string | Record<string, any>,
        public errors?: any,
    ) {
        super(message);

        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }

    toString() {
        const args: any[] = [this.name, this.message];

        if (this.errors) {
            args.push(this.errors);
        }
        return args.join(" - ");
    }
}
