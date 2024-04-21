const DataLoader = require('dataloader');
const { Comment } = require('../models/dbModels');;

const batchComment = async (commentsIds) => {
    try {
        const comments = await Comment.find({ '_id': { $in: commentsIds } });
        const commentsMap = comments.reduce((map, comment) => {
            map[comment._id.toString()] = comment;
            return map;
        }, {});
        return commentsIds.map((id) => commentsMap[id.toString()]);
    } catch (error) {
        return commentsIds.map(() => null);
    }
}


const commentsLoader = new DataLoader(batchComment);

module.exports = {
    commentsLoader,
}