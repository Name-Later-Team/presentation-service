import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
	getHello(): string {
		return "Hello World!";
	}

	ping(): string {
		return "Hello, I'm presentation service";
	}
}
