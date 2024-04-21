const DataLoader = require('dataloader');
const { TransAction } = require('../models/dbModels');;

const batchTransactions = async (userIds) => {
    const transactions = await TransAction.find({ userId: { $in: userIds } });

    const transactionMap = new Map();
    userIds.forEach((userId) => {
        transactionMap.set(userId.toString(), transactions.filter((tx) => tx.userId.toString() === userId.toString()));
    });

    return userIds.map((userId) => transactionMap.get(userId.toString()));
};


const transactionLoader = new DataLoader(batchTransactions);

module.exports = {
    transactionLoader
};
