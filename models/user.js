import {Schema, model, models} from "mongoose";

const userSchema = new Schema({
    email:{
        type: String,
        unique: [true, "Email already exist"],
        required: [true, "Email is required"],
    },
    username:{
        type: String,
        unique: [true, "Username already exist"],
        required: [true, "Username is required"],
        match: [/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username is invalid, it should contain 4-20 alphanumeric characters and be unique!"],
    },
    image: {
        type: String,
    },
    cart: {
        type: Schema.Types.Mixed,
    },
    address: {
        type: Schema.Types.Mixed,
    }

})

const User = models.User || model("User", userSchema);

export default User;