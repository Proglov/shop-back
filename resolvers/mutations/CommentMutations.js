const { isAdmin } = require('../../lib/Functions');

const CommentAdd = async (_parent, args, context) => {
    const {
        body,
        parentCommentId,
        parentProductId
    } = args.input;

    const { Comment, Product } = context.db
    const { userInfo } = context

    try {
        //check for Authorization
        if (!userInfo || !userInfo?.userId) {
            throw new Error("You Are Not Authorized")
        }

        const newComment = await Comment({
            body,
            userId: userInfo.userId,
            parentCommentId
        })

        newComment.save();

        if (parentProductId) {
            const product = await Product.findById(parentProductId);
            product.commentsIds.push(newComment.id);
            product.save();
        }

        return {
            message: "Comment has been Added Successfully",
            status: true
        }

    } catch (error) {
        return {
            message: error.message,
            status: false
        }
    }

}

const CommentUpdate = async (_parent, args, context) => {
    const {
        id,
        body,
    } = args;

    const { Comment } = context.db
    const { userInfo } = context

    try {
        //check for Authorization
        if (!userInfo || !userInfo?.userId) {
            throw new Error("You Are Not Authorized")
        }

        //only admin can update a comment
        if (!(await isAdmin(userInfo.userId))) {
            throw new Error("You Are Not Authorized")
        }

        //body is required
        if (!body) {
            throw new Error("body is required")
        }

        await Comment.findByIdAndUpdate(
            id,
            {
                $set: {
                    body,
                }
            },
            { new: true }
        )

        return {
            message: "Comment has been Updated Successfully",
            status: true
        }

    } catch (error) {
        return {
            message: error.message,
            status: false
        }
    }

}

const CommentDelete = async (_parent, args, context) => {
    const {
        id,
    } = args;

    const { Comment, Product } = context.db
    const { userInfo } = context

    try {
        //check for Authorization
        if (!userInfo || !userInfo?.userId) {
            throw new Error("You Are Not Authorized")
        }

        //only admin can Delete a comment
        if (!(await isAdmin(userInfo.userId))) {
            throw new Error("You Are Not Authorized")
        }

        const deletedComment = await Comment.findByIdAndDelete(id);

        // Also delete the children comments
        if (deletedComment && deletedComment.validated) {
            await Comment.deleteMany({ parentCommentId: id });
        }

        //also delete from product comments
        await Product.findOneAndUpdate(
            { commentsIds: { $in: [id] } },
            { $pull: { commentsIds: { $in: [id] } } },
            { new: true }
        );

        return {
            message: "Comment has been Deleted Successfully",
            status: true
        }

    } catch (error) {
        return {
            message: error.message,
            status: false
        }
    }

}

const CommentToggleLike = async (_parent, args, context) => {
    const {
        id,
    } = args;

    const { Comment } = context.db
    const { userInfo } = context

    try {
        //check for Authorization
        if (!userInfo || !userInfo?.userId) {
            throw new Error("You Are Not Authorized")
        }

        // Find the comment by commentId
        const comment = await Comment.findById(id);

        if (!comment) {
            throw new Error('Comment not found');
        }

        // Check if userId is already in the likes array
        const userIndex = comment.likes.indexOf(userInfo?.userId);

        if (userIndex > -1) {
            // User already liked the comment, remove from likes array
            comment.likes.splice(userIndex, 1);
        } else {
            // User didn't like the comment, add to likes array
            comment.likes.push(userInfo?.userId);

            //if user used to dislike the comment, remove it
            const userIndexDis = comment.disLikes.indexOf(userInfo?.userId);

            if (userIndexDis > -1) {
                comment.disLikes.splice(userIndexDis, 1);
            }
        }

        // Save the updated comment with likes changes
        await comment.save();

        return {
            message: "Comment has been toggled like Successfully",
            status: true
        }

    } catch (error) {
        return {
            message: error.message,
            status: false
        }
    }

}

const CommentToggleDisLike = async (_parent, args, context) => {
    const {
        id,
    } = args;

    const { Comment } = context.db
    const { userInfo } = context

    try {
        //check for Authorization
        if (!userInfo || !userInfo?.userId) {
            throw new Error("You Are Not Authorized")
        }

        // Find the comment by commentId
        const comment = await Comment.findById(id);

        if (!comment) {
            throw new Error('Comment not found');
        }

        // Check if userId is already in the disLikes array
        const userIndex = comment.disLikes.indexOf(userInfo?.userId);

        if (userIndex > -1) {
            // User already liked the comment, remove from disLikes array
            comment.disLikes.splice(userIndex, 1);
        } else {
            // User didn't dislike the comment, add to disLikes array
            comment.disLikes.push(userInfo?.userId);

            //if user used to like the comment, remove it
            const userIndexLike = comment.likes.indexOf(userInfo?.userId);

            if (userIndexLike > -1) {
                comment.likes.splice(userIndexLike, 1);
            }
        }

        // Save the updated comment with disLikes changes
        await comment.save();

        return {
            message: "Comment has been toggled disLike Successfully",
            status: true
        }

    } catch (error) {
        return {
            message: error.message,
            status: false
        }
    }

}

const CommentToggleValidate = async (_parent, args, context) => {
    const {
        id,
    } = args;

    const { Comment } = context.db
    const { userInfo } = context

    try {
        //check for Authorization
        if (!userInfo || !userInfo?.userId) {
            throw new Error("You Are Not Authorized")
        }

        //only admin can toggle validated a comment
        if (!(await isAdmin(userInfo.userId))) {
            throw new Error("You Are Not Authorized")
        }

        // Find the comment by commentId
        const comment = await Comment.findById(id);

        if (!comment) {
            throw new Error('Comment not found');
        }

        comment.validated = !comment.validated

        // Save the updated comment with disLikes changes
        await comment.save();

        return {
            message: "Comment has been toggled validated Successfully",
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
    CommentAdd,
    CommentUpdate,
    CommentDelete,
    CommentToggleLike,
    CommentToggleDisLike,
    CommentToggleValidate
}