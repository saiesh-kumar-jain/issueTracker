const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
        return value.toISOString();
    },
    parseValue(value) {
        //return new Date(value);
        const dateValue = new Date(value);
        //return isNaN(dateValue) ? undefined : dateValue;
        return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
    },
    parseLiteral(ast) {
        //return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
        if (ast.kind == Kind.STRING) {
            const value = new Date(ast.value);
            //return isNaN(value) ? undefined : value;
            return Number.isNaN(value.getTime()) ? undefined : value;
        }
        return undefined;
    },
});

module.exports = GraphQLDate;