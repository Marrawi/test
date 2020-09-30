exports.authType = `

type Massage {
  status: Boolean
}

type Withdraws {
  withdrawID: ID
  withdrawDate: String
  withdrawType: String
  withdrawSize: Int
  isWithdrawVerified: Boolean
  isWithdrawWaiting: Boolean
  isWithdrawSuccess: Boolean
}

type Tag {
  id: ID
  massage: String
}

type Requirement {
  id: ID
  massage: String
}

type Step {
  id: ID
  massage: String
}

type Proof {
  id: ID
  massage: String
  userProof: String
}

type UserProofs {
  id: ID
  proof: String
}

type UserFeed {
  userId: ID
  userProofs: [UserProofs]
  createdAt: String
  updatedAt: String
  waitToVerify: Boolean
  success: Boolean
  failed: Boolean
  faildMassage: String
}

type Work {
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

type User {
  status: Boolean
  token: String!
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

input signUp {
  email: String!
  username: String!
  password: String!
  phoneType: String!
  phone: String!
  recaptchaToken: String!
}

union MassageResult = Massage | Error

`;

exports.authQuery = `
signIn(username: String!, password: String!, recaptchaToken: String!): UserResult!
reset(email: String!, recaptchaToken: String!): MassageResult!
emailSend(email: String!, recaptchaToken: String!): MassageResult!
`;

exports.authMutation = `
signUp(input: signUp): MassageResult!
resetVerify(verifyToken: String!, password: String!, recaptchaToken: String!): MassageResult!
emailVerfiy(verifyToken: String!): MassageResult!
`;
