import * as restify from "restify";

const mpContentType = "application/merge-patch+json";

export const mergePatchBodyParser = (
  req: restify.Request,
  resp: restify.Response,
  next
) => {
  if (req.method === "PATCH" && req.getContentType() === mpContentType) {
    (<any>req).rawBody = req.body;
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      return next(new Error(`Invalid content: ${e.message}`));
    }
  }

  return next();
};
