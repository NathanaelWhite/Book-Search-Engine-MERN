// const express = require("express");
// const path = require("path");
// const { ApolloServer } = require("apollo-server-express");
// const { authMiddleware } = require('./utils/auth');

// const { typeDefs, resolvers } = require('./schemas');
// const db = require("./config/connection");
// const routes = require("./routes");

// const app = express();
// const PORT = process.env.PORT || 3001;

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: authMiddleware
// });

// async function startup() {
//   await server.startup();
//   server.applyMiddleware({ app });
// }
// startup();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));
// }

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// app.use(routes);

// db.once("open", () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

async function startup() {
  await server.start();
  server.applyMiddleware({ app });
}
startup();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});