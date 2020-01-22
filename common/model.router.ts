import * as mongoose from "mongoose";
import { Router } from "../common/router";
import { NotFoundError } from "restify-errors";

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
  basePath: string;
  pageSize = 1;

  constructor(protected model: mongoose.Model<D>) {
    super();
    this.basePath = `/${model.collection.name}`;
  }

  envelope(document: any): any {
    const resource = Object.assign({ _links: {} }, document.toJSON());
    resource._links.self = `${this.basePath}/${resource._id}`;
    return resource;
  }

  envelopeAll(documents: any, options: any = {}): any {
    const resource: any = {
      items: documents,
      ...options
    };
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

  protected prepareOne(
    query: mongoose.DocumentQuery<D, D>
  ): mongoose.DocumentQuery<D, D> {
    return query;
  }

  validateId = (req, resp, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError("Document Not Found"));
    } else {
      next();
    }
  };

  findAll = (req, resp, next) => {
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

  findById = (req, resp, next) => {
    this.prepareOne(this.model.findById(req.params.id))
      .then(this.render(resp, next))
      .catch(next);
  };

  save = (req, resp, next) => {
    let document = new this.model(req.body);
    document
      .save()
      .then(this.render(resp, next))
      .catch(next);
  };

  replace = (req, resp, next) => {
    const options = { overwrite: true, runValidators: true };
    this.model
      .update({ _id: req.params.id }, req.body, options)
      .exec()
      .then(result => {
        if (result.n) {
          return this.model.findById(req.params.id);
        }
        resp.send(new NotFoundError());
      })
      .then(this.render(resp, next))
      .catch(next);
  };

  update = (req, resp, next) => {
    const options = { new: true, runValidators: true };
    this.model
      .findByIdAndUpdate({ _id: req.params.id }, req.body, options)
      .then(this.render(resp, next))
      .catch(next);
  };

  delete = (req, resp, next) => {
    this.model
      .remove({ _id: req.params.id })
      .exec()
      .then((cmdResult: any) => {
        if (cmdResult.result.n) {
          resp.send(204);
          return next();
        }

        resp.send(new NotFoundError());
        return next();
      })
      .catch(next);
  };
}
