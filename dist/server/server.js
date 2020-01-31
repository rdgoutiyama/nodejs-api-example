"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
const token_parser_1 = require("../security/token.parser");
const fs = require("fs");
const logger_1 = require("../dist/common/logger");
class Server {
    initializeDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url, {});
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                const options = {
                    name: "hello-api",
                    version: "1.0.0",
                    log: logger_1.logger
                };
                if (environment_1.environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment_1.environment.security.certificate);
                    options.key = fs.readFileSync(environment_1.environment.security.key);
                }
                this.application = restify.createServer(options);
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                this.application.use(token_parser_1.tokenParser);
                this.application.pre(restify.plugins.requestLogger({
                    log: logger_1.logger
                }));
                // this.application.get("/hello", (request, response, next) => {
                //   response.json({ message: "hello" });
                //   return next();
                // });
                routers.map(router => router.applyRoutes(this.application));
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
                // this.application.on(
                //   "after",
                //   restify.plugins.auditLogger({
                //     log: logger,
                //     event: "after"
                //     // body: true
                //   })
                // );
                this.application.on("restifyError", error_handler_1.errorHandler);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
