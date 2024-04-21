const { commentsLoader } = require('../loader/ProductLoaders');

const getAllComments = async (parent, _args, _context) => {
    const { commentsIds } = parent;
    return commentsLoader.loadMany(commentsIds);
}


const Product = {
    comments: getAllComments
}

module.exports = Product;
