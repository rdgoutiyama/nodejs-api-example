"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Router extends events_1.EventEmitter {
    render(resp, next) {
        return document => {
            if (document) {
                this.emit("beforeResponse", document);
                resp.json(document);
                return next();
            }
            resp.send(404);
            return next();
        };
    }
}
exports.Router = Router;
