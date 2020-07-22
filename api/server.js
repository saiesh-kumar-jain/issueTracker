const fs = require('fs')
require('dotenv').config()
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { GraphQLScalarType, UserInputError } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require("mongodb")

const url = process.env.DB_URL || "mongodb://localhost/issuetracker"
let db

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

let aboutMessage = 'Issue Tracker API 1.0';

const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList,
    },
    Mutation: {
        setAboutMessage,
        issueAdd,
    },
    GraphQLDate
};

function issueValidate(issue) {
    const errors = [];
    if (issue.title.length < 3) {
        errors.push('Field "title" must be at least 3 characters long.')
    }
    if (issue.status == 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is "Assigned"');
    }
    if (errors.length > 0) {
        throw new UserInputError('Invalid input(s)', { errors });
    }
}

async function getNextSequence(name) {
    const result = await db.collection('counters').findOneAndUpdate(
        { _id: name },
        { $inc: { current: 1 } },
        { returnOriginal: false },
    );
    return result.value.current;
}

async function issueAdd(_, { issue }) {
    issueValidate(issue);
    const newIssue = Object.assign({}, issue);
    newIssue.created = new Date();
    //issue.id = issuesDB.length + 1;
    newIssue.id = await getNextSequence('issues');
    // if (issue.status == undefined) issue.status = 'New';
    const result = await db.collection('issues').insertOne(newIssue);
    //issuesDB.push(issue);
    const savedIssue = await db.collection('issues')
        .findOne({ _id: result.insertedId });
    return savedIssue;
    //return issue;
}

function setAboutMessage(_, { message }) {
    aboutMessage = message;
    return aboutMessage;
}

async function issueList() {
    //return issuesDB;
    const issues = await db.collection('issues').find({}).toArray();
    return issues;
}

async function connectToDb() {
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    },
});
const app = express()

const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
console.log('CORS setting:', enableCors);

server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

const port = process.env.API_SERVER_PORT || 3000;

(async function start() {
    try {
        await connectToDb();
        app.listen(port,  () => {
            console.log('API server started on port 3000');
        });
    } catch (err) {
        console.log('ERROR:', err);
    }
}());