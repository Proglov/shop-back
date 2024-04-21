const { userLoader, productLoader } = require('../loader/TransActionLoaders');


const user = async (parent, _args, _context) => {
    const { userId } = parent;

    try {
        return await userLoader.load(userId);
    } catch (error) {
        return null;
    }
};

const boughtProductsResolver = async (parent, _args, _context) => {
    const { boughtProducts } = parent;

    try {
        const productIds = boughtProducts.map((product) => product.productId);
        const products = await productLoader.loadMany(productIds);

        const resolvedProducts = boughtProducts.map((product) => {
            const foundProduct = products.find((p) => p.id === product.productId.toString());
            return {
                product: foundProduct,
                quantity: product.quantity,
            };
        });

        return resolvedProducts;
    } catch (error) {
        return null;
    }
};


const boughtAt = async (parent, _args, _context) => {
    const { createdAt } = parent;

    try {
        return createdAt
    } catch (error) {
        return null;
    }
};


const TransAction = {
    user,
    boughtProducts: boughtProductsResolver,
    boughtAt
}

module.exports = TransAction;
