const { buildSchema } = require('graphql');
const { authType, authQuery, authMutation } = require('./auth');
const { dataType, dataQuery, dataMutation } = require('./data');

module.exports = buildSchema(`
  schema {
    query: RootQuery
    mutation: RootMutation
  }

  ${authType}
  ${dataType}

  type RootQuery {
    ${authQuery}
    ${dataQuery}
  }

  type RootMutation {
    ${authMutation}
    ${dataMutation}
  }

  `)
