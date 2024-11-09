import { GraphQLError } from "graphql";
import { authSchema } from "../../validators/auth.validator";
import { GraphQLContext } from "../context";
import { passwordCrypt, Auth } from "../../libs";

const typeDefs = /* GraphQL */ `
  type Mutation {
    signUp(dto: SignUp): User!
    signIn(dto: SignIn): AuthPayload!
  }

  input SignUp {
    name: String!
    password: String!
  }

  input SignIn {
    name: String!
    password: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }
`;

type AuthArgs = {
  dto: {
    name: string;
    password: string;
  };
};
const resolvers = {
  Mutation: {
    signUp: async (_: any, args: AuthArgs, ctx: GraphQLContext) => {
      const { dto } = args;
      const { data, success, error } = authSchema.safeParse(dto);

      if (!success) throw new GraphQLError(error.errors[0].message);

      const { name, password } = data;
      const hashedPassword = await passwordCrypt.hashPassword(password);

      const user = await ctx.prisma.user.create({
        data: {
          name,
          password: hashedPassword,
        },
        include: {
          posts: true,
          comments: true,
          favorite_posts: true,
        },
      });

      return user;
    },
    signIn: async (_: any, args: AuthArgs, ctx: GraphQLContext) => {
      const { dto } = args;
      const { data, success, error } = authSchema.safeParse(dto);

      if (!success) throw new GraphQLError(error.errors[0].message);
      const { name, password } = data;
      const user = await ctx.prisma.user.findUnique({
        where: {
          name,
        },
      });

      if (!user)
        throw new GraphQLError("User not found with the provided name!");
      const isCorrectPassword = await passwordCrypt.verifyPassword(
        password,
        user.password
      );

      if (!isCorrectPassword) throw new GraphQLError("Wrong password.");

      const token = Auth.generateToken({ userId: user.id });
      // Setting a header for authorization
      ctx.request.headers.set("Authorization", `Bearer ${token}`);

      return {
        token,
        user,
      };
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
