import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import {prisma} from './lib/db'

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
        type Mutation{
            createUser(input:UserInput!):User
        }
        type User{
          id:ID!
          firstName:String!
          lastName:String!
          email:String!
          roll:Int!
          password:String!
        }

        input UserInput{
          firstName: String!
          lastName: String!
          profileImageUrl: String
          email:String!
          password: String!
          salt: String
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
        },
        Mutation:{  
          createUser:async(_,args)=>{
            return await prisma.user.create({
              data:{
                firstName:args.input.firstName,
                lastName:args.input.lastName,
                email:args.input.email,
                password:args.input.password,
                salt:args.input.salt|| "random_salt"
              },
              select:{
                id:true,
                firstName:true,
                lastName:true,
                email:true,
                password:true,
                roll:true
              }
            })
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
