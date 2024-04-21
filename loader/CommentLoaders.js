const DataLoader = require('dataloader');
const { Comment, User } = require('../models/dbModels');;

const batchUsers = async (userIds) => {
    const users = await User.find({ _id: { $in: userIds } }).select('-password');

    const userMap = new Map();
    users.forEach((user) => {
        userMap.set(user._id.toString(), user);
    });

    return userIds.map((userId) => userMap.get(userId.toString()));
};

const batchChildrenComment = async (ids) => {
    const comments = await Comment.find({ parentCommentId: { $in: ids } });

    // Group comments by parentCommentId
    const commentsByParentId = comments.reduce((acc, comment) => {
        const parentId = comment.parentCommentId.toString();
        if (acc[parentId]) {
            acc[parentId].push(comment);
        } else {
            acc[parentId] = [comment];
        }

        return acc;
    }, {});

    // Return comments in the same order as ids
    return ids.map((id) => commentsByParentId[id.toString()] || []);
};

const batchLikes = async (likes) => {
    const users = await User.find({ _id: { $in: likes } }).select('-password');

    const userMap = new Map();
    users.forEach((user, index) => {
        const userId = user._id.toString();
        userMap.set(userId, index);
    });

    const sortedUsers = likes.map((like) => {
        const userId = like.toString();
        const userIndex = userMap.get(userId);
        return users[userIndex];
    });

    return sortedUsers;
};


const batchDisLikes = async (disLikes) => {
    const users = await User.find({ _id: { $in: disLikes } }).select('-password');

    const userMap = new Map();
    users.forEach((user, index) => {
        const userId = user._id.toString();
        userMap.set(userId, index);
    });

    const sortedUsers = disLikes.map((disLike) => {
        const userId = disLike.toString();
        const userIndex = userMap.get(userId);
        return users[userIndex];
    });

    return sortedUsers;
};



const usersLoader = new DataLoader(batchUsers);
const childrenCommentsLoader = new DataLoader(batchChildrenComment);
const likesLoader = new DataLoader(batchLikes);
const disLikesLoader = new DataLoader(batchDisLikes);

module.exports = {
    usersLoader,
    childrenCommentsLoader,
    likesLoader,
    disLikesLoader
};
