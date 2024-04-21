const { isAdmin } = require('../lib/Functions');

const getMe = async (_parent, _args, context) => {

    const { User } = context.db
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            return null
        }

        return await User.findById(userInfo?.userId).select('-password');


    } catch (error) {
        return null
    }

}

const getUsers = async (_parent, args, context) => {

    const { User } = context.db
    const { userInfo } = context;
    const { page, perPage } = args;

    try {
        //check if req contains token
        if (!userInfo) {
            throw new Error("You Are Not Authorized")
        }

        //only admin can get the users
        if (!(await isAdmin(userInfo.userId))) {
            throw new Error("You Are Not Authorized")
        }

        if (!page || !perPage)
            return await User.find().select('-password');
        const skip = (page - 1) * perPage;
        return await User.find().select('-password').skip(skip).limit(perPage);


    } catch (error) {
        return null
    }

}

const isUserAdmin = async (_parent, _args, context) => {

    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            return null
        }

        return await isAdmin(userInfo.userId)


    } catch (error) {
        return null
    }

}

const getUsersCount = async (_parent, _args, context) => {
    const { User } = context.db
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            throw new Error("You Are Not Authorized")
        }

        //only admin can get the users
        if (!(await isAdmin(userInfo.userId))) {
            throw new Error("You Are Not Authorized")
        }

        return await User.where().countDocuments().exec();

    } catch (error) {
        return 0
    }

}

const getAllProducts = async (_parent, args, context) => {
    const { Product } = context.db
    const { page, perPage } = args;
    if (!page || !perPage)
        return await Product.find({});
    const skip = (page - 1) * perPage;
    return await Product.find({}).skip(skip).limit(perPage);

}

const getProductsCount = async (_parent, _args, context) => {
    const { Product } = context.db
    return await Product.where().countDocuments().exec();

}

const getOneProduct = async (_parent, args, context) => {
    const { Product } = context.db
    const { id } = args
    return await Product.findById(id);
}

const getAllComments = async (_parent, args, context) => {
    const { Comment } = context.db
    const { page, perPage, validated } = args;

    //get all of them if validated is not specified
    if ((validated == undefined || validated == null) && validated !== false) {
        if (!page || !perPage)
            return await Comment.find({});
        const skip = (page - 1) * perPage;
        return await Comment.find({}).skip(skip).limit(perPage);

    }

    //if validated is true
    if (!!validated) {
        if (!page || !perPage)
            return await Comment.find({ validated: true });
        const skip = (page - 1) * perPage;
        return await Comment.find({ validated: true }).skip(skip).limit(perPage);
    }

    //if validated is false
    if (!page || !perPage)
        return await Comment.find({ validated: false });
    const skip = (page - 1) * perPage;
    return await Comment.find({ validated: false }).skip(skip).limit(perPage);
}

const getCommentsCount = async (_parent, args, context) => {
    const { Comment } = context.db
    const { validated } = args;
    if (!!validated || validated === false)
        return await Comment.where({ validated }).countDocuments().exec();
    return await Comment.where().countDocuments().exec();

}

const getOneComment = async (_parent, args, context) => {
    const { Comment } = context.db
    const { id } = args
    return await Comment.findById(id);
}

const getAllTransActions = async (_parent, args, context) => {
    const { TransAction } = context.db
    const { userInfo } = context;
    const { page, perPage, isFutureOrder } = args;

    try {
        //check if req contains token
        if (!userInfo) {
            return null
        }

        //only admin can get the users
        if (!(await isAdmin(userInfo.userId))) {
            throw new Error("You Are Not Authorized")
        }

        //if isFutureOrder is not specified
        if ((isFutureOrder == undefined || isFutureOrder == null) && isFutureOrder !== false) {
            if (!page || !perPage)
                return await TransAction.find();
            const skip = (page - 1) * perPage;
            return await TransAction.find().skip(skip).limit(perPage);
        }

        const currentDate = (new Date()).getTime();

        //future Orders
        if (!!isFutureOrder) {
            if (!page || !perPage)
                return await TransAction.find({ shouldBeSentAt: { $gte: currentDate } });
            const skip = (page - 1) * perPage;
            return await TransAction.find({ shouldBeSentAt: { $gte: currentDate } }).skip(skip).limit(perPage);
        }

        //past Orders
        if (!page || !perPage)
            return await TransAction.find({ shouldBeSentAt: { $lt: currentDate } });
        const skip = (page - 1) * perPage;
        return await TransAction.find({ shouldBeSentAt: { $lt: currentDate } }).skip(skip).limit(perPage);



    } catch (error) {
        return null
    }
}

const getOneTransAction = async (_parent, args, context) => {
    const { id } = args
    const { TransAction } = context.db
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            return null
        }

        const tx = await TransAction.findById(id)

        //only admin and himself can get the tx

        if (!(await isAdmin(userInfo?.userId)) && userInfo?.userId !== tx.userId) {
            throw new Error("You are not authorized!")
        }

        return tx


    } catch (error) {
        return null
    }
}

const getTransActionsCount = async (_parent, args, context) => {
    const { TransAction } = context.db
    const { userInfo } = context;
    const { isFutureOrder } = args;

    try {
        //check if req contains token
        if (!userInfo) {
            throw new Error("You Are Not Authorized")
        }

        //only admin can get the users
        if (!(await isAdmin(userInfo.userId))) {
            throw new Error("You Are Not Authorized")
        }

        if (isFutureOrder === undefined || isFutureOrder === null) {
            return await TransAction.where().countDocuments().exec();
        }

        const currentDate = (new Date()).getTime();

        if (!isFutureOrder)
            return await TransAction.where({ shouldBeSentAt: { $lt: currentDate } }).countDocuments().exec();
        return await TransAction.where({ shouldBeSentAt: { $gte: currentDate } }).countDocuments().exec();

    } catch (error) {
        return 0
    }

}

const Query = {
    UserGetMe: getMe,
    UsersGet: getUsers,
    UserIsAdmin: isUserAdmin,
    UsersCount: getUsersCount,
    Products: getAllProducts,
    ProductsCount: getProductsCount,
    Product: getOneProduct,
    Comments: getAllComments,
    Comment: getOneComment,
    CommentsCount: getCommentsCount,
    TransActions: getAllTransActions,
    TransAction: getOneTransAction,
    TransActionsCount: getTransActionsCount,
}

module.exports = Query;
