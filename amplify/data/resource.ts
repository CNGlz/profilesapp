import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Profile: a
    .model({
      name: a.string().required(),
      bio: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
