import { createSchema } from "graphql-yoga";
import User from "./models/user";
import Post from "./models/post";
import Comment from "./models/comment";

import { merge } from "lodash";

const schema = createSchema({
  typeDefs: [User.typeDefs, Post.typeDefs, Comment.typeDefs],
  resolvers: merge(User.resolvers, Post.resolvers, Comment.resolvers),
});

export default { schema };
