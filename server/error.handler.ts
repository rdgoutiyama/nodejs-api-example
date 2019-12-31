import * as restify from "restify";

export const errorHandler = (
  req: restify.Request,
  resp: restify.Response,
  err,
  done
) => {
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
      break;
  }

  return done();
};
