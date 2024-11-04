import db from "../../libs/prisma-client";

const typeDefs = /* GraphQL */ `
  type Query {
    user(id: Int): User
    users: [User!]!
  }

  type User {
    id: Int!
    name: String!
    posts: [Post]!
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const users = await db.user.findMany({
        include: {
          posts: true,
        },
      });
      return users;
    },
    user: async ({ id }: { id: number }) => {
      const user = await db.user.findUnique({
        where: { id },
        include: {
          comments: true,
          posts: true,
        },
      });

      return user;
    },
  },
};

export default { typeDefs, resolvers };
