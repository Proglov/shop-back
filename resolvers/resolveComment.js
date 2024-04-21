const { usersLoader, childrenCommentsLoader, likesLoader, disLikesLoader } = require('../loader/CommentLoaders');

const user = async (parent, _args, _context) => {
    const { userId } = parent

    try {
        return await usersLoader.load(userId)
    } catch (error) {
        return null
    }

}

const childrenComment = async (parent, _args, _context) => {
    const { id } = parent;
    try {
        return await childrenCommentsLoader.load(id);
    } catch (error) {
        return null
    }
}

const likesResolver = async (parent, _args, _context) => {

    const { likes } = parent;

    try {

        const users = await likesLoader.loadMany(likes);

        const number = users.length;

        return {
            users,
            number
        }

    } catch (error) {
        return null
    }

}

const disLikesResolver = async (parent, _args, _context) => {

    const { disLikes } = parent;

    try {

        const users = await disLikesLoader.loadMany(disLikes);
        const number = users.length;

        return {
            users,
            number
        }

    } catch (error) {
        return null
    }

}

const Comment = {
    user,
    childrenComment,
    likes: likesResolver,
    disLikes: disLikesResolver
}

module.exports = Comment;
