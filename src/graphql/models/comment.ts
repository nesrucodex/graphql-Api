const typeDefs = /* GraphQL */ `
  type Comment {
    id: Int!
    user: User!
    message: String!
    createdAt: String!
  }
`;

const resolvers = {
  Query: {},
};

export default { typeDefs, resolvers };
