"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Router extends events_1.EventEmitter {
    envelope(document) {
        return document;
    }
    envelopeAll(documents, options) {
        return documents;
    }
    render(resp, next) {
        return document => {
            if (document) {
                this.emit("beforeResponse", document);
                resp.json(this.envelope(document));
                return next();
            }
            resp.send(404);
            return next(false);
        };
    }
    renderAll(resp, next, options = {}) {
        return (documents) => {
            if (documents) {
                documents.forEach((document, index, arr) => {
                    this.emit("beforeResponse", document);
                    arr[index] = this.envelope(document);
                });
                resp.json(this.envelopeAll(documents, options));
            }
            else {
                resp.json([]);
            }
            return next();
        };
    }
}
exports.Router = Router;
