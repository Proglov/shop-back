const { isAdmin } = require('../../lib/Functions');

const ProductCreate = async (_parent, args, context) => {
    const {
        name,
        desc,
        price,
        category,
        subcategory,
        offPercentage,
        imagesUrl,
    } = args.input;

    const { Product } = context.db;
    const { userInfo } = context;


    try {
        if (!userInfo) {
            throw new Error("You are not authorized!")
        }

        if (!(await isAdmin(userInfo?.userId))) {
            throw new Error("You are not authorized!")
        }

        const newProduct = new Product({
            name,
            desc,
            price,
            category,
            subcategory,
            offPercentage,
            imagesUrl
        })

        await newProduct.save();

        return {
            message: null,
            Product: newProduct
        }

    } catch (error) {
        return {
            message: error.message,
            Product: null
        }
    }



}


const ProductUpdate = async (_parent, args, context) => {
    const {
        id,
        name,
        desc,
        price,
        category,
        subcategory,
        offPercentage,
        imagesUrl,
        commentsIds
    } = args.input;

    const { Product } = context.db;
    const { userInfo } = context;


    try {
        if (!userInfo) {
            throw new Error("You are not authorized!")
        }

        if (!(await isAdmin(userInfo?.userId))) {
            throw new Error("You are not authorized!")
        }

        const existingProduct = await Product.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    desc,
                    price,
                    category,
                    subcategory,
                    offPercentage,
                    imagesUrl,
                    commentsIds,
                }
            },
            { new: true }
        );

        if (!existingProduct) {
            throw new Error("Product doesn't exist")
        }

        return {
            message: null,
            Product: existingProduct
        }

    } catch (error) {
        return {
            message: error.message,
            Product: null
        }
    }



}


const ProductDelete = async (_parent, args, context) => {

    const { Product } = context.db;
    const { userInfo } = context;

    try {
        if (!userInfo) {
            throw new Error("You are not authorized!")
        }

        if (!(await isAdmin(userInfo?.userId))) {
            throw new Error("You are not authorized!")
        }

        await Product.findByIdAndDelete(args.id)

        return {
            message: "Product has been deleted successfully",
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
    ProductCreate,
    ProductUpdate,
    ProductDelete
}