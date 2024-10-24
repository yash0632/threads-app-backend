import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app: Application = express();

  dotenv.config();
  app.use(express.json())
  const port = Number(process.env.PORT) || 8000;

  const gqlserver = new ApolloServer({
    typeDefs: `#graphql
        type Query{
            hello:String,
            say(name:String!):String!
        }

    `,
    resolvers: {
        Query:{
            hello() {
                return "hello world,i am a graphql server"
            },
            say:(_,{name}:{name:string})=>{
                return "hello " + name
            }
        }
    },
  });

  //start the gql server
  await gqlserver.start();

  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "server is up and running and started" });
    return;
  });

  app.use('/graphql',expressMiddleware(gqlserver))

  app.listen(port, () => console.log("app is listening on port ", port));
}
init()
