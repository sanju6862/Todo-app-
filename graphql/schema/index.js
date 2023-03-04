 
const {buildSchema} = require('graphql');

module.exports = buildSchema(` 
type Task {
    _id: ID! 
    title: String!
    priority: Float!
    date: String
    complete: Boolean!
    start: String
    end: String
    intervalK: Float
    intervalN: String
    creator: User!
} 

type User {
    _id: ID!
    email: String!
    password: String
    confirmed: Boolean
    createdAt: String!
    updatedAt: String! 
    createdTasks: [Task!]
}

type Msgs {
    msgs: String
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    email: String!
}

input TaskInput {
    title: String!
    priority: Float!
    date: String
    complete: Boolean!
    start: String
    end: String
    intervalK: Float
    intervalN: String
}

input UpdateTaskInput {
    title: String
    priority: Float
    date: String
    start: String
    end: String
    intervalK: Float
    intervalN: String
}

input UserInput {
    email: String!
    password: String!
}

input ConfirmInput {
    emailToken: String!
}

input SocialAuthInput {
    email: String!
    accessToken: String!
}

input ResetPasswordEmailInput {
    email: String!
}

input ResetPasswordInput {
    emailToken: String!
    password: String!
}

input ChangeEmailInput {
    newEmail: String!
    password: String!
}

type RootQuery {
    tasks: [Task!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createTask(taskInput: TaskInput): Task
    createUser(userInput: UserInput): AuthData!
    confirmUser(confirmInput: ConfirmInput): Msgs
    authFacebook(facebookInput: SocialAuthInput!): AuthData!
    authGoogle(googleInput: SocialAuthInput!): AuthData!
    resetPasswordEmail(resetPasswordInput: ResetPasswordEmailInput): Msgs
    resetPassword(resetPasswordInput: ResetPasswordInput): User!
    changeEmail(newEmail: String!, password: String!): AuthData
    changePassword(password: String!, newPassword: String!): Msgs
    deleteUser(userId: ID!): Msgs
    updateTask(taskId: ID!, taskInput: UpdateTaskInput): Task!
    completeTask(taskId: ID!): Task!
    deleteTask(taskId: ID!): Task!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
