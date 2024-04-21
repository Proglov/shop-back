const { isAdmin } = require('../../lib/Functions');


const TransActionCreate = async (_parent, args, context) => {
    const { boughtProducts, address, shouldBeSentAt } = args;

    const { TransAction, Product } = context.db
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo || !userInfo?.userId) {
            throw new Error("You are not authorized!")
        }

        if (!boughtProducts?.length) {
            throw new Error("boughtProducts is required");
        }

        let totalPrice = 0;

        for (let i = 0; i < boughtProducts.length; i++) {
            const thisProduct = await Product.findById(boughtProducts[i].productId);
            const thisPrice = thisProduct.price * boughtProducts[i].quantity
            totalPrice += thisPrice
        }

        const newTransAction = new TransAction({
            userId: userInfo.userId,
            totalPrice,
            boughtProducts,
            address,
            shouldBeSentAt
        });

        await newTransAction.save();

        return {
            message: "TransAction is successfully added",
            status: true
        }


    } catch (error) {
        return {
            message: error.message,
            status: false
        }
    }
}

const TransActionDelete = async (_parent, args, context) => {
    const { id } = args;

    const { TransAction } = context.db
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            throw new Error("You are not authorized!")
        }

        //don't let the user if they're neither admin nor they don't own the account
        if (!(await isAdmin(userInfo?.userId))) {
            throw new Error("You are not authorized!")
        }

        await TransAction.findByIdAndDelete(id)

        return {
            message: `TransAction ${id} has been deleted`,
            status: true
        }


    } catch (error) {
        return {
            message: error.message,
            status: false
        }
    }

}


module.exports = {
    TransActionCreate,
    TransActionDelete
}