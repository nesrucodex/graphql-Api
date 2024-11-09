import { YogaInitialContext } from "graphql-yoga";
import { PrismaClient, User } from "@prisma/client";
import prisma from "../libs/prisma-client";
import Auth from "../libs/auth";

export type GraphQLContext = {
  prisma: PrismaClient;
  user: null | User;
} & YogaInitialContext;

const createContext = async (
  initialContext: YogaInitialContext
): Promise<GraphQLContext> => {
  const user = await Auth.authenticateUser(prisma, initialContext.request);

  return {
    prisma,
    user,
    ...initialContext,
  };
};

export default createContext;
