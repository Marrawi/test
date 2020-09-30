exports.dataType = `

type Error {
  status: Boolean
  code: Int
  massage: String
}

type Data {
  status: Boolean
  email: String!
  username: String!
  money: String!
  phoneType: String!
  phone: String!
  blocked: Boolean!
  totalProfit: Int
  totalUsers: Int
  siteAge: Int
  withdraws: [Withdraws]
  work: [Work]
}

type siteInfo {
  status: Boolean
  totalProfit: Int
  totalUsers: Int
  siteAge: Int
}

type Task {
  status: Boolean
  id: ID
  name: String
  timeToFinish: Int
  paid: Int
  isOpen: Boolean
  priority: Int
  tags: [Tag]
  requirements: [Requirement]
  steps: [Step]
  explainLink: String
  proofs: [Proof]
  finisedTopNum: Int
  createdAt: String
  userFeed: [UserFeed]
}

union DataResult = Data | Error
union TaskResult = Task | Error
union UserResult = User | Error

`;

exports.dataQuery =`
getData: DataResult!
getSiteInfo: siteInfo
getThisTask(workID: ID!): TaskResult
`;

exports.dataMutation = `
updateData(phone: String!, phoneType: String!): DataResult
postWithdraw(withdrawType: String!): DataResult
sendProof( workID: ID, data: String): DataResult
`;
