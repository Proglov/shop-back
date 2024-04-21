const { transactionLoader } = require('../loader/UserLoaders');
const txs = async (parent, _args, _context) => {
    const { id } = parent;

    try {
        return await transactionLoader.load(id)
    } catch (error) {
        return null;
    }
};


module.exports = { txs };
