import { User } from "./users/users.model";
import { Request } from "restify";
import "jest-extended";

declare module "restify" {
  export interface Request {
    authenticated: User;
  }
}
