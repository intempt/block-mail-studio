
import { User, UserAttribute, UserDetails, VariableOption } from '@/types/user';
import usersData from '@/data/users.json';
import userAttributesData from '@/data/userAttributes.json';
import variablesData from '@/data/variables.json';

export const users: User[] = usersData;

export const userAttributes: UserAttribute[] = userAttributesData;

export const dummyVariables: VariableOption[] = variablesData;

export const getUserDetails = (profileId: string, identifier: string): UserDetails => {
  return {
    firstSeen: "2023-12-01",
    lastSeen: "2024-01-15",
    identifiers: [identifier],
    totalEvents: 42,
    sources: ["web", "mobile"],
    segments: {
      "active_users": true,
      "premium_customers": false
    },
    segmentQueryIds: [1, 2],
    attributes: [
      {
        attrId: "email",
        title: "Email",
        value: identifier,
        lastUpdated: "2024-01-15"
      },
      {
        attrId: "profile",
        title: "Profile ID", 
        value: profileId,
        lastUpdated: "2024-01-15"
      }
    ]
  };
};
