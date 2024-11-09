import { User } from "@prisma/client";
import { GraphQLContext } from "../context";

const typeDefs = /* GraphQL */ `
  type Query {
    user(id: Int): User
    users: [User!]!
  }

  type Mutation {
    deleteUser(id: Int!): User
    updateUser(id: Int!, data: UpdateUserDTO): User
  }

  input UpdateUserDTO {
    name: String
  }

  type User {
    id: Int!
    name: String!
    password: String!
    posts: [Post]!
  }
`;

const resolvers = {
  Query: {
    users: async (parent: any, args: {}, ctx: GraphQLContext) => {
      const users = await ctx.prisma.user.findMany({
        include: {
          posts: true,
        },
      });
      return users;
    },
    user: async (parent: any, args: { id: number }, ctx: GraphQLContext) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: args.id },
        include: {
          comments: true,
          posts: true,
        },
      });

      return user;
    },
  },
  User: {
    name: (obj: User) => {
      return obj.name.trim();
    },
  },
  Mutation: {
    deleteUser: async (_: any, dto: { id: number }, ctx: GraphQLContext) => {
      const deletedUser = await ctx.prisma.user.delete({
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
    updateUser: async (
      _: any,
      dto: { id: number; data: { name: string } },
      ctx: GraphQLContext
    ) => {
      const {
        id,
        data: { name },
      } = dto;
      if (!name || !name.trim())
        throw new Error("Invalid user input, name field is required!");
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) throw new Error("User not found!");

      const updatedUser = await ctx.prisma.user.update({
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
