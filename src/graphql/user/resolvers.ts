import { User } from "."
import UserService,{CreateUserPayload,GetUserTokenPayload} from "../../services/user"




const queries = {
    getUserToken:async(_:any,args:GetUserTokenPayload)=>{
        return await UserService.getUserToken(args)
    }
}
const mutations = {
    createUser:async(_:any,args:CreateUserPayload)=>{
        const res = await UserService.createUser(args)
        return res.id;
    },

   
}

export const resolvers = {queries,mutations} 