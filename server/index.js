require('dotenv').config();
require('colors');
// const corsOptions = require('../config/corsOptions');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema/schema');
const resolvers = require('../resolvers/index');
const { User, Product, Comment, TransAction } = require('../models/dbModels');

const { getUserFromToken } = require('../lib/Functions');


const PORT = process.env.PORT || 3500;
const connectDB = require('../config/db');


//connect to the database
connectDB()


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const userInfo = await getUserFromToken(req.headers.authorization)
        return {
            db: {
                User,
                Product,
                Comment,
                TransAction
            },
            userInfo
        }

    },
    csrfPrevention: true,
    // cors: corsOptions,
})

server.listen(PORT, () => console.log(`server running on port ${PORT}`.blue))
