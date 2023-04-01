import { Express } from "express-serve-static-core";

declare global {
    namespace Express {
        interface Request {
            // add additional property for express request object
            userinfo: {
                username: string;
                identifier: string;
                type: string;
                displayName: string;
                firstName: string;
                lastName: string;
                avatar: string;
                email: string;
            } & Record<string, any>;

            // additional field for add raw body as text
            text: string;
        }
    }
}
