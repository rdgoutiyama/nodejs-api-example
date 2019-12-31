"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = (req, resp, err, done) => {
    err.toJSON = () => {
        return {
            message: err.message
        };
    };
    switch (err.name) {
        case "MongoError":
            if (err.code === 11000) {
                err.statusCode = 400;
            }
            break;
        case "ValidationError":
            err.statusCode = 400;
            const messages = [];
            for (let name in err.errors) {
                messages.push({ message: err.errors[name].message });
            }
            err.toJSON = () => {
                return messages;
            };
            break;
    }
    return done();
};
