import * as bunyan from "bunyan";
import { environment } from "../../common/environment";

export const logger = bunyan.createLogger({
  name: environment.log.name,
  level: (<any>bunyan).resolveLevel(environment.log.level)
});
