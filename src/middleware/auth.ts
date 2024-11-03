import jwt from "jsonwebtoken";
import { asyncWrapper, RouteError } from "../utils";
import { ENV } from "../config";

const authenticationMiddleWare = asyncWrapper(async (req, _, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader)
    throw new RouteError.Unauthorized("You are't authenticated");
  const token = authorizationHeader.split(" ")[1];

  if (!token || !token.trim())
    throw new RouteError.BadRequest(
      "Token not provided in autherization header."
    );

  const payload = jwt.verify(token, ENV.JWT_SECRET) as {
    userId: string;
  };

  const { userId } = payload;
  req.user = { _id: userId };
  next();
});

export default { authenticationMiddleWare };
