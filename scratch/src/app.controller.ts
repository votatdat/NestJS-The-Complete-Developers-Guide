import { Controller, Get } from "@nestjs/common";

@Controller("/hello")
export class AppController {
  @Get("/test")
  getRootRoute() {
    return "Hi there!";
  }

  @Get("/bye")
  getByeThere() {
    return "Bye there!";
  }
}
