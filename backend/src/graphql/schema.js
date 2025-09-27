'use strict';
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Doctor { id: ID!, name: String!, specialties: [String!]!, active: Boolean! }
  type Nurse { id: ID!, name: String!, skills: [String!]!, active: Boolean! }
  type Room { id: ID!, name: String!, capacity: Int!, active: Boolean! }
  type Device { id: ID!, name: String!, status: String!, meta: JSON }
  scalar JSON

  type ScheduleEvent {
    id: ID!
    title: String!
    procedureType: String!
    startISO: String!
    endISO: String!
    roomId: ID!
    doctorId: ID!
    nurseIds: [ID!]!
    deviceIds: [ID!]!
    status: String!
    notes: String
  }

  input ScheduleInput {
    title: String!
    procedureType: String!
    startISO: String!
    endISO: String!
    roomId: ID!
    doctorId: ID!
    nurseIds: [ID!]!
    deviceIds: [ID!]!
    status: String!
    notes: String
  }

  type Conflict { type: String!, message: String!, relatedEventId: ID }
  type ScheduleResult { data: ScheduleEvent, conflicts: [Conflict!] }

  type Query {
    doctors: [Doctor!]!
    nurses: [Nurse!]!
    rooms: [Room!]!
    devices: [Device!]!
    schedules(status: String, from: String, to: String): [ScheduleEvent!]!
    schedule(id: ID!): ScheduleEvent
  }

  type Mutation {
    createSchedule(input: ScheduleInput!, allowConflicts: Boolean): ScheduleResult!
    updateSchedule(id: ID!, patch: JSON!, allowConflicts: Boolean): ScheduleResult
    deleteSchedule(id: ID!): Boolean!
    setDeviceStatus(id: ID!, status: String!, meta: JSON): Device
  }
`);

module.exports = { schema };
