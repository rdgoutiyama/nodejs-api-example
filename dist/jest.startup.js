"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
pm;
const jestCli = require("jest-cli");
const server_1 = require("./server/server");
const environment_1 = require("./common/environment");
const users_router_1 = require("./users/users.router");
const users_model_1 = require("./users/users.model");
const reviews_router_1 = require("./reviews/reviews.router");
const review_model_1 = require("./reviews/review.model");
let server;
let address;
const beforeAllTests = () => {
    environment_1.environment.db.url =
        process.env.DB_URL || "mongodb://localhost/meat-api-test-db";
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    address = `${global.address}:${environment_1.environment.server.port}`;
    server = new server_1.Server();
    return server
        .bootstrap([users_router_1.usersRouter, reviews_router_1.reviewsRouter])
        .then(() => users_model_1.User.remove({}).exec())
        .then(() => {
        const user = new users_model_1.User();
        user.email = "admin@tester.com";
        user.name = "TESTER";
        user.password = "123456";
        user.profiles = ["admin", "user"];
        return user.save();
    })
        .then(() => review_model_1.Review.remove({}).exec());
};
const afterAllTests = () => {
    return server.shutdown();
};
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .then(() => console.log('cadeia de then linda!'))
    .catch(console.error);
