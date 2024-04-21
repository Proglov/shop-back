const { gql } = require('apollo-server');


const typeDefs = gql`

    type Query{
        UsersGet(page:Int, perPage:Int): [User],
        UserGetMe:User,
        UserIsAdmin:Boolean,
        UsersCount:Int!,
        #########################################################################
        Products(page:Int, perPage:Int):[Product],
        ProductsCount:Int!,
        Product(id:ID!):Product,
        #########################################################################
        Comments(page:Int, perPage:Int, validated:Boolean):[Comment!],
        Comment(id:ID!):Comment,
        CommentsCount(validated:Boolean):Int!,
        #########################################################################
        TransActions(page:Int, perPage:Int, isFutureOrder:Boolean):[TransAction!],
        TransAction(id:ID!):TransAction,
        TransActionsCount(isFutureOrder:Boolean):Int!,
    }

    type Mutation{
        UserSignUp(phone:String!):UserOutput!,
        UserSignInWithPhone(phone:String!):UserOutput!,
        UserSignInWithEmailOrUsername(emailOrUsername:String!, password:String!):UserOutput!,
        UserUpdate(input:UserUpdateInput):UserOutput!,
        UserDelete(id:ID!):MessageAndStatus!,
        #########################################################################
        ProductCreate(input:ProductCreateInput):ProductOutput!,
        ProductUpdate(input:ProductUpdateInput):ProductOutput!,
        ProductDelete(id:ID!):MessageAndStatus!,
        #########################################################################
        CommentAdd(input:CommentAddInput):MessageAndStatus!
        CommentUpdate(id:ID!,body:String!):MessageAndStatus!
        CommentDelete(id:ID!):MessageAndStatus!
        CommentToggleLike(id:ID!):MessageAndStatus!
        CommentToggleDisLike(id:ID!):MessageAndStatus!
        CommentToggleValidate(id:ID!):MessageAndStatus!
        #########################################################################
        TransActionCreate(boughtProducts:[BoughtProductInput!], address:String!,shouldBeSentAt:String!):MessageAndStatus!,
        TransActionDelete(id:ID!):MessageAndStatus!,
    }

    type User{
        id: ID!,
        name: String,
        email: String,
        username: String,
        password: String,
        address: [String],
        phone: String!,
        role: String!,
        txs:[TransAction]
    }

    type Product{
        id: ID!,
        name: String!,
        desc: String,
        price: Int!,
        category: String!,
        subcategory: String!,
        offPercentage: Int,
        imagesUrl: [String],
        comments:[Comment]
    }

    type Comment{
        id: ID!,
        user: User,
        childrenComment:[Comment!],
        body: String!,
        likes: likeAndDisLikeType!,
        disLikes: likeAndDisLikeType!,
        validated: Boolean!,
    }

    type likeAndDisLikeType{
        users:[User!],
        number:Int!
    }

    type BoughtProduct{
        product: Product,
        quantity:  Int!
    }

    type TransAction{
        id: ID!,
        user: User,
        totalPrice:Int,
        boughtProducts: [BoughtProduct],
        address:String,
        shouldBeSentAt:String,
        boughtAt: String
    }

    type UserOutput{
        message: String,
        token: String
    }

    type MessageAndStatus{
        message: String,
        status: Boolean
    }

    input UserUpdateInput{
        id: ID!,
        name: String,
        email: String,
        username: String,
        password: String,
        address: [String],
        phone: String
    }

    type ProductOutput{
        message: String,
        Product: Product
    }

    input ProductCreateInput{
        name: String!,
        desc: String,
        price: Int!,
        category: String!,
        subcategory: String!,
        offPercentage: Int,
        imagesUrl: [String]
    }

    input ProductUpdateInput{
        id:ID!,
        name: String,
        desc: String,
        price: Int,
        category: String,
        subcategory: String,
        offPercentage: Int,
        imagesUrl: [String],
        commentsIds:[ID!]
    }

    input CommentAddInput{
        body:String!,
        parentCommentId:ID,
        parentProductId:ID
    }

    input BoughtProductInput{
        productId: ID!,
        quantity:  Int!
    }

`

module.exports = typeDefs