import { connectToDB } from "@util/database";
import User from "@models/user";

export const PATCH = async (request ,{params}) => {
    const{cart} = await request.json()
    console.log(params)
    try {
        await connectToDB();

        const existingUser = await User.findById(params.id);

        if(!existingUser) return newResponse("Prompt not Found", {status: 404})

        existingUser.cart = cart;
        console.log(existingUser)
        await existingUser.save();

        return new Response(JSON.stringify(existingUser), {status:200})
    } catch (error) {
        return new Response('Failed to update prompt', {status: 500})
    }
}