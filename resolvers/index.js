const resolvers = {
    Query: require('./Query'),
    Mutation: require('./Mutation'),
    User: require('./resolveUser'),
    Comment: require('./resolveComment'),
    Product: require('./resolveProduct'),
    TransAction: require('./resolveTransAction')
}

module.exports = resolvers