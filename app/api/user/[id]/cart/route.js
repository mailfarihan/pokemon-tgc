import { connectToDB } from "@util/database";
import User from "@models/user";

// GET (read)
export const GET = async (request, {params}) => {
    try {
        await connectToDB();

        const user =  await User.findOne({ email: params.id });
        if(!user) return new Response("User not found", {status:404})
        return new Response(JSON.stringify(user), {status:200})
    } catch (error) {
        return new Response("Failed to fetch all user", {status:500})
    }
}

export const PATCH = async (request ,{params}) => {
    const{cart} = await request.json()

    try {
        await connectToDB();

        const existingUser = await User.findOne({ email: params.id });
        if(!existingUser) return newResponse("Prompt not Found", {status: 404})
        
        existingUser.cart = cart;
        await existingUser.save();

        return new Response(JSON.stringify(existingUser), {status:200})
    } catch (error) {
        return new Response('Failed to update prompt', {status: 500})
    }
}
