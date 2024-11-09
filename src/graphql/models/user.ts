import { User } from "@prisma/client";
import { GraphQLContext } from "../context";
import { GraphQLError } from "graphql";

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
    users: async (_: any, __: {}, ctx: GraphQLContext) => {
      const user = ctx.user;
      if (!user)
        throw new GraphQLError("You aren't authorized to get users info.");

      const isAdmin = user.role === "ADMIN";
      if (!isAdmin)
        throw new GraphQLError("You aren't admin to get users info.");
      const users = await ctx.prisma.user.findMany({
        include: {
          posts: true,
        },
      });
      return users;
    },
    user: async (_: any, args: { id: number }, ctx: GraphQLContext) => {
      const user = ctx.user;
      if (!user)
        throw new GraphQLError("You aren't authorized to get a user info.");

      const isAdmin = user.role === "ADMIN";
      if (!isAdmin)
        throw new GraphQLError("You aren't admin to get user info.");
      const userData = await ctx.prisma.user.findUnique({
        where: { id: args.id },
        include: {
          comments: true,
          posts: true,
        },
      });

      return userData;
    },
  },
  User: {
    name: (obj: User) => {
      return obj.name.trim();
    },
  },
  Mutation: {
    deleteUser: async (_: any, dto: { id: number }, ctx: GraphQLContext) => {
      const user = ctx.user;
      if (!user)
        throw new GraphQLError("You aren't authorized to delete a user.");
      const isAdmin = user.role === "ADMIN";
      if (!isAdmin)
        throw new GraphQLError("You aren't admin to delete a user.");

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
      const user = ctx.user;
      if (!user)
        throw new GraphQLError("You aren't authorized to update a user info.");
      const isAdmin = user.role === "ADMIN";
      if (!isAdmin)
        throw new GraphQLError("You aren't admin to update a user info.");

      const {
        id,
        data: { name },
      } = dto;
      if (!name || !name.trim())
        throw new Error("Invalid user input, name field is required!");
      const userToBeUpdated = await ctx.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!userToBeUpdated) throw new Error("User not found!");

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
