const DataLoader = require('dataloader');
const { User, Product } = require('../models/dbModels');;

const batchUser = async (userIds) => {
    const users = await User.find({ '_id': { $in: userIds } }).select("-password");

    // Return users in the same order as userIds
    return userIds.map((id) => users.find((user) => user.id === id.toString()));
}

const batchProduct = async (productIds) => {
    const products = await Product.find({ _id: { $in: productIds } });
    // Return products in the same order as productIds
    return productIds.map((id) => products.find((product) => product.id === id.toString()));
}

const userLoader = new DataLoader(batchUser);
const productLoader = new DataLoader(batchProduct);

module.exports = {
    userLoader,
    productLoader
}