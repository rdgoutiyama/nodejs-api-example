"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const router_1 = require("../common/router");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.pageSize = 1;
        this.validateId = (req, resp, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError("Document Not Found"));
            }
            else {
                next();
            }
        };
        this.findAll = (req, resp, next) => {
            let pageSizeDefault = req.query._pageSize
                ? parseInt(req.query._pageSize)
                : this.pageSize;
            let page = parseInt(req.query._page || 1);
            page = page > 0 ? page : 1;
            const skip = (page - 1) * pageSizeDefault;
            this.model
                .count({})
                .exec()
                .then(count => {
                const options = {
                    pageSize: pageSizeDefault,
                    count,
                    page,
                    url: req.url
                };
                this.model
                    .find()
                    .skip(skip)
                    .limit(pageSizeDefault)
                    .then(this.renderAll(resp, next, options))
                    .catch(next);
            });
        };
        this.findById = (req, resp, next) => {
            this.prepareOne(this.model.findById(req.params.id))
                .then(this.render(resp, next))
                .catch(next);
        };
        this.save = (req, resp, next) => {
            let document = new this.model(req.body);
            document
                .save()
                .then(this.render(resp, next))
                .catch(next);
        };
        this.replace = (req, resp, next) => {
            const options = { overwrite: true, runValidators: true };
            this.model
                .update({ _id: req.params.id }, req.body, options)
                .exec()
                .then(result => {
                if (result.n) {
                    return this.model.findById(req.params.id);
                }
                resp.send(new restify_errors_1.NotFoundError());
            })
                .then(this.render(resp, next))
                .catch(next);
        };
        this.update = (req, resp, next) => {
            const options = { new: true, runValidators: true };
            this.model
                .findByIdAndUpdate({ _id: req.params.id }, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.delete = (req, resp, next) => {
            this.model
                .remove({ _id: req.params.id })
                .exec()
                .then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                    return next();
                }
                resp.send(new restify_errors_1.NotFoundError());
                return next();
            })
                .catch(next);
        };
        this.basePath = `/${model.collection.name}`;
    }
    envelope(document) {
        const resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }
    envelopeAll(documents, options = {}) {
        const resource = Object.assign({ items: documents }, options);
        const page = options.page;
        if (page && options.count && options.pageSize) {
            let previewsPage = page;
            let nextPage = page;
            if (page > 1) {
                previewsPage = previewsPage - 1;
                resource._previews = `${this.basePath}?_page=${previewsPage}`;
            }
            const remaining = options.count - options.pageSize * page;
            if (remaining > 0) {
                nextPage = nextPage + 1;
                resource._next = `${this.basePath}?_page=${nextPage}`;
            }
        }
        return resource;
    }
    prepareOne(query) {
        return query;
    }
}
exports.ModelRouter = ModelRouter;
