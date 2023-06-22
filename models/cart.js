import {Schema, model, models} from "mongoose";

const cartSchema = new Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    item: {
        type: Schema.Types.Mixed,
    },

})

const Cart = models.Cart || model("Cart", userSchema);

export default Cart;