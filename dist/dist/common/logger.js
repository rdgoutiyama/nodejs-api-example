"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require("bunyan");
const environment_1 = require("../../common/environment");
exports.logger = bunyan.createLogger({
    name: environment_1.environment.log.name,
    level: bunyan.resolveLevel(environment_1.environment.log.level)
});
