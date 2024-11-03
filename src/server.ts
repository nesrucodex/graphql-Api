import { createServer } from "http";
import app from "./app";
import { ENV } from "./config";

const server = createServer(app);

const PORT = ENV.PORT;

server.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
