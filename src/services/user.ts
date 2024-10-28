import { prismaClient } from "../lib/db"
import {createHmac,randomBytes} from "node:crypto"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export interface CreateUserPayload {
    firstName : string
    lastName? : string
    email : string
    password : string
}

export interface GetUserTokenPayload {
    email :string
    password:string
}


class UserService {
    private static generateHash(salt:string,password:string){
        const hashedPassword = createHmac('sha256',salt).update(password).digest('hex')
        return hashedPassword
    }


    public static createUser(payload:CreateUserPayload) {
        const {firstName,lastName,email,password} = payload;
        const salt = randomBytes(32).toString("hex")
        const hashedPassword = UserService.generateHash(salt,password)
        const res = prismaClient.user.create({
            data:{
                firstName,
                lastName,
                email,
                password:hashedPassword,
                salt
            },
        })
        return res
    }

    public static async getUserToken(payload:GetUserTokenPayload) {
        const {email,password} = payload;
        const res = await prismaClient.user.findFirst({
            where:{
                email:email
            }
        })
        if(!res){
            throw new Error("NO User with this email")
        }

        const newHashedPassword = UserService.generateHash(res.salt,password)
        if(newHashedPassword != res?.password){
            throw new Error("user password is wrong")
        }
        const SECRET_KEY = process.env.SECRET_KEY||"aarti"

        const token = jwt.sign({
            id:res.id,
            email:res.email
        },SECRET_KEY)
        return token.toString()
    }   

}

export default UserService