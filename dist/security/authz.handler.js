"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
exports.authorize = (...profiles) => {
    return (req, resp, next) => {
        if (req.authenticated !== undefined &&
            req.authenticated.hasAny(...profiles)) {
            req.log.debug("User %s is authorized with profiles %j on route %j. Required profiles %j", req.authenticated._id, req.authenticated.profiles, req.path(), profiles);
            next();
        }
        else {
            if (req.authenticated) {
                req.log.debug("Permission Denied for: %s. Required Profiles: %j. User Profiles %j", req.authenticated._id, profiles, req.authenticated.profiles);
            }
            next(new restify_errors_1.ForbiddenError("Permission denied"));
        }
    };
};
