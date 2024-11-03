import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`.
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

export default limiter;
