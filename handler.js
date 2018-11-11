"use strict";

const { ApolloServer, gql } = require("apollo-server-lambda");
require("dotenv").config();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    pages: [Page]
    page(slug: ID!): Page
  }

  type Page {
    slug: String!
    siteName: String
    body: String
    metaDescription: String
    metaTitle: String
    metaImage: String
    sections: [Section]
  }

  type Section {
    name: String
    body: String
    template: String
    identifier: String
    content: [Content]
  }

  type Content {
    name: String
    body: String
    image: String
    imageFile: String
  }
`;

// console.log("test", process.env);

// const baseURL = process.env.BASE_URL;
// console.log("baseUrl", baseUrl);

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
    page: (parent, args) => {
      const { slug } = args;
      return fetch(`${process.env.BASE_URL}/pages/${slug}?lang=en`).then(res =>
        res.json()
      );
    }
    // pages: async () => {
    //   const res = await fetch(`${baseURL}`);
    //   console.log("res.json()", res.json());
    //   return res.json();
    // }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();

module.exports.hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
