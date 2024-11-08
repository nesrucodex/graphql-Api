import db from "../../libs/prisma-client";

const typeDefs = /* GraphQL */ `
  type Query {
    user(id: Int): User
    users: [User!]!
  }

  type Mutation {
    createUser(data: CreateUserDTO!): User
    deleteUser(id: Int!): User
    updateUser(id: Int!, data: UpdateUserDTO): User
  }

  input CreateUserDTO {
    name: String!
  }

  input UpdateUserDTO {
    name: String
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
  User: {
    name: (obj: { name: string }) => {
      return obj.name.trim().toUpperCase();
    },
  },
  Mutation: {
    createUser: async (_: any, dto: { data: { name: string } }) => {
      const newUser = await db.user.create({
        data: {
          name: dto.data.name,
        },
        include: {
          posts: {
            include: {
              comments: true,
              likes: true,
            },
          },
          comments: true,
        },
      });
      return newUser;
    },
    deleteUser: async (_: any, dto: { id: number }) => {
      const deletedUser = await db.user.delete({
        where: {
          id: dto.id,
        },
        include: {
          posts: {
            include: {
              comments: true,
              likes: true,
            },
          },
          comments: true,
        },
      });

      return deletedUser;
    },
    updateUser: async (_: any, dto: { id: number; data: { name: string } }) => {
      const {
        id,
        data: { name },
      } = dto;
      if (!name || !name.trim())
        throw new Error("Invalid user input, name field is required!");
      const user = await db.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) throw new Error("User not found!");

      const updatedUser = await db.user.update({
        where: {
          id,
        },
        data: {
          name,
        },
        include: {
          posts: {
            include: {
              comments: true,
              likes: true,
            },
          },
          comments: true,
        },
      });

      return updatedUser;
    },
  },
};

export default { typeDefs, resolvers };
