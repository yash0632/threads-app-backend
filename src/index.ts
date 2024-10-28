import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import  createApolloGraphqlServer  from "./graphql/index";

async function init() {
  const app: Application = express();

  dotenv.config();
  app.use(express.json())
  const port = Number(process.env.PORT) || 8000;

  

  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "server is up and running and started" });
  });

  app.use('/graphql',expressMiddleware(await createApolloGraphqlServer()))

  app.listen(port, () => console.log("app is listening on port", port));
}
init()
