const ProductMutations = require('./mutations/ProductMutations');
const UserMutations = require('./mutations/UserMutations');
const CommentMutations = require('./mutations/CommentMutations');
const TransActionMutations = require('./mutations/TransActionMutations');

const Mutation = {
    ...ProductMutations,
    ...UserMutations,
    ...CommentMutations,
    ...TransActionMutations
}

module.exports = Mutation