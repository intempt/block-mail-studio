
export interface UserAttributeField {
  name: string;
  title: string;
  objectType: string;
  itemsType: string | null;
  items: any | null;
  possibleValues: string[] | null;
}

export interface UserAttributeSchemaField {
  name: string;
  type: (string | string[])[];
  default: any;
}

export interface UserAttributeSchema {
  type: string;
  name: string;
  fields: UserAttributeSchemaField[];
}

export interface UserAttribute {
  id: string;
  name: string;
  attributeType: "extracted" | "computed" | "event" | "custom";
  type: "user" | "event" | "system";
  title: string;
  description: string;
  example: string;
  active: boolean;
  segmentationAvailable: boolean;
  pii: boolean;
  unique: boolean;
  schema: UserAttributeSchema;
  fields: UserAttributeField[];
  fieldNames: string[];
  strategy: "first" | "last" | "count" | "sum" | "avg" | "min" | "max";
}

export const userAttributes: UserAttribute[] = [
  {
    "id": "1",
    "name": "user_owner",
    "attributeType": "extracted",
    "type": "user",
    "title": "User owner",
    "description": "Intempt user owner",
    "example": "",
    "active": true,
    "segmentationAvailable": true,
    "pii": true,
    "unique": true,
    "schema": {
      "type": "record",
      "name": "user_owner",
      "fields": [
        {
          "name": "intempt_user_owner",
          "type": [
            "null",
            "long"
          ],
          "default": null
        }
      ]
    },
    "fields": [
      {
        "name": "intempt_user_owner",
        "title": "User owner",
        "objectType": "long",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      }
    ],
    "fieldNames": [],
    "strategy": "last"
  },
  {
    "id": "2",
    "name": "user_email",
    "attributeType": "extracted",
    "type": "user",
    "title": "Email Address",
    "description": "User's primary email address",
    "example": "john.doe@company.com",
    "active": true,
    "segmentationAvailable": true,
    "pii": true,
    "unique": true,
    "schema": {
      "type": "record",
      "name": "user_email",
      "fields": [
        {
          "name": "email",
          "type": [
            "null",
            "string"
          ],
          "default": null
        }
      ]
    },
    "fields": [
      {
        "name": "email",
        "title": "Email",
        "objectType": "string",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      }
    ],
    "fieldNames": ["email"],
    "strategy": "last"
  },
  {
    "id": "3",
    "name": "user_signup_date",
    "attributeType": "extracted",
    "type": "user",
    "title": "Signup Date",
    "description": "Date when user signed up",
    "example": "2024-01-15T10:30:00Z",
    "active": true,
    "segmentationAvailable": true,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_signup_date",
      "fields": [
        {
          "name": "signup_date",
          "type": [
            "null",
            "string"
          ],
          "default": null
        }
      ]
    },
    "fields": [
      {
        "name": "signup_date",
        "title": "Signup Date",
        "objectType": "datetime",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      }
    ],
    "fieldNames": ["signup_date"],
    "strategy": "first"
  },
  {
    "id": "4",
    "name": "user_subscription_tier",
    "attributeType": "extracted",
    "type": "user",
    "title": "Subscription Tier",
    "description": "User's subscription level",
    "example": "premium",
    "active": true,
    "segmentationAvailable": true,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_subscription_tier",
      "fields": [
        {
          "name": "subscription_tier",
          "type": [
            "null",
            "string"
          ],
          "default": null
        }
      ]
    },
    "fields": [
      {
        "name": "subscription_tier",
        "title": "Subscription Tier",
        "objectType": "string",
        "itemsType": null,
        "items": null,
        "possibleValues": ["free", "basic", "premium", "enterprise"]
      }
    ],
    "fieldNames": ["subscription_tier"],
    "strategy": "last"
  },
  {
    "id": "5",
    "name": "user_total_purchases",
    "attributeType": "computed",
    "type": "user",
    "title": "Total Purchases",
    "description": "Total number of purchases made by user",
    "example": "12",
    "active": true,
    "segmentationAvailable": true,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_total_purchases",
      "fields": [
        {
          "name": "total_purchases",
          "type": [
            "null",
            "int"
          ],
          "default": 0
        }
      ]
    },
    "fields": [
      {
        "name": "total_purchases",
        "title": "Total Purchases",
        "objectType": "int",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      }
    ],
    "fieldNames": ["total_purchases"],
    "strategy": "count"
  },
  {
    "id": "6",
    "name": "user_lifetime_value",
    "attributeType": "computed",
    "type": "user",
    "title": "Lifetime Value",
    "description": "Total revenue generated by user",
    "example": "1250.50",
    "active": true,
    "segmentationAvailable": true,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_lifetime_value",
      "fields": [
        {
          "name": "lifetime_value",
          "type": [
            "null",
            "double"
          ],
          "default": 0.0
        }
      ]
    },
    "fields": [
      {
        "name": "lifetime_value",
        "title": "Lifetime Value",
        "objectType": "double",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      }
    ],
    "fieldNames": ["lifetime_value"],
    "strategy": "sum"
  },
  {
    "id": "7",
    "name": "user_last_active",
    "attributeType": "extracted",
    "type": "user",
    "title": "Last Active",
    "description": "Last time user was active",
    "example": "2024-12-08T14:30:00Z",
    "active": true,
    "segmentationAvailable": true,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_last_active",
      "fields": [
        {
          "name": "last_active",
          "type": [
            "null",
            "string"
          ],
          "default": null
        }
      ]
    },
    "fields": [
      {
        "name": "last_active",
        "title": "Last Active",
        "objectType": "datetime",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      }
    ],
    "fieldNames": ["last_active"],
    "strategy": "last"
  },
  {
    "id": "8",
    "name": "user_preferences",
    "attributeType": "extracted",
    "type": "user",
    "title": "User Preferences",
    "description": "User's preferences and settings",
    "example": "{\"theme\": \"dark\", \"notifications\": true}",
    "active": true,
    "segmentationAvailable": false,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_preferences",
      "fields": [
        {
          "name": "preferences",
          "type": [
            "null",
            "string"
          ],
          "default": null
        }
      ]
    },
    "fields": [
      {
        "name": "preferences",
        "title": "Preferences",
        "objectType": "json",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      }
    ],
    "fieldNames": ["preferences"],
    "strategy": "last"
  },
  {
    "id": "9",
    "name": "user_device_types",
    "attributeType": "extracted",
    "type": "user",
    "title": "Device Types",
    "description": "Types of devices user has used",
    "example": "[\"mobile\", \"desktop\"]",
    "active": true,
    "segmentationAvailable": true,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_device_types",
      "fields": [
        {
          "name": "device_types",
          "type": [
            "null",
            {
              "type": "array",
              "items": "string"
            }
          ],
          "default": null
        }
      ]
    },
    "fields": [
      {
        "name": "device_types",
        "title": "Device Types",
        "objectType": "array",
        "itemsType": "string",
        "items": null,
        "possibleValues": ["mobile", "desktop", "tablet"]
      }
    ],
    "fieldNames": ["device_types"],
    "strategy": "last"
  },
  {
    "id": "10",
    "name": "user_age_group",
    "attributeType": "computed",
    "type": "user",
    "title": "Age Group",
    "description": "User's age group classification",
    "example": "25-34",
    "active": true,
    "segmentationAvailable": true,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_age_group",
      "fields": [
        {
          "name": "age_group",
          "type": [
            "null",
            "string"
          ],
          "default": null
        }
      ]
    },
    "fields": [
      {
        "name": "age_group",
        "title": "Age Group",
        "objectType": "string",
        "itemsType": null,
        "items": null,
        "possibleValues": ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
      }
    ],
    "fieldNames": ["age_group"],
    "strategy": "last"
  },
  {
    "id": "11",
    "name": "user_location",
    "attributeType": "extracted",
    "type": "user",
    "title": "Location",
    "description": "User's geographic location",
    "example": "San Francisco, CA",
    "active": true,
    "segmentationAvailable": true,
    "pii": true,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_location",
      "fields": [
        {
          "name": "city",
          "type": [
            "null",
            "string"
          ],
          "default": null
        },
        {
          "name": "state",
          "type": [
            "null",
            "string"
          ],
          "default": null
        },
        {
          "name": "country",
          "type": [
            "null",
            "string"
          ],
          "default": null
        }
      ]
    },
    "fields": [
      {
        "name": "city",
        "title": "City",
        "objectType": "string",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      },
      {
        "name": "state",
        "title": "State",
        "objectType": "string",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      },
      {
        "name": "country",
        "title": "Country",
        "objectType": "string",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      }
    ],
    "fieldNames": ["city", "state", "country"],
    "strategy": "last"
  },
  {
    "id": "12",
    "name": "user_engagement_score",
    "attributeType": "computed",
    "type": "user",
    "title": "Engagement Score",
    "description": "User's engagement score from 0-100",
    "example": "75",
    "active": true,
    "segmentationAvailable": true,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_engagement_score",
      "fields": [
        {
          "name": "engagement_score",
          "type": [
            "null",
            "int"
          ],
          "default": 0
        }
      ]
    },
    "fields": [
      {
        "name": "engagement_score",
        "title": "Engagement Score",
        "objectType": "int",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      }
    ],
    "fieldNames": ["engagement_score"],
    "strategy": "avg"
  },
  {
    "id": "13",
    "name": "user_referral_source",
    "attributeType": "extracted",
    "type": "user",
    "title": "Referral Source",
    "description": "How the user was referred to the platform",
    "example": "google_ads",
    "active": true,
    "segmentationAvailable": true,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_referral_source",
      "fields": [
        {
          "name": "referral_source",
          "type": [
            "null",
            "string"
          ],
          "default": null
        }
      ]
    },
    "fields": [
      {
        "name": "referral_source",
        "title": "Referral Source",
        "objectType": "string",
        "itemsType": null,
        "items": null,
        "possibleValues": ["organic", "google_ads", "facebook_ads", "email", "referral", "direct"]
      }
    ],
    "fieldNames": ["referral_source"],
    "strategy": "first"
  },
  {
    "id": "14",
    "name": "user_account_status",
    "attributeType": "extracted",
    "type": "user",
    "title": "Account Status",
    "description": "Current status of user account",
    "example": "active",
    "active": true,
    "segmentationAvailable": true,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_account_status",
      "fields": [
        {
          "name": "account_status",
          "type": [
            "null",
            "string"
          ],
          "default": null
        }
      ]
    },
    "fields": [
      {
        "name": "account_status",
        "title": "Account Status",
        "objectType": "string",
        "itemsType": null,
        "items": null,
        "possibleValues": ["active", "inactive", "suspended", "pending_verification"]
      }
    ],
    "fieldNames": ["account_status"],
    "strategy": "last"
  },
  {
    "id": "15",
    "name": "user_session_count",
    "attributeType": "computed",
    "type": "user",
    "title": "Session Count",
    "description": "Total number of user sessions",
    "example": "47",
    "active": true,
    "segmentationAvailable": true,
    "pii": false,
    "unique": false,
    "schema": {
      "type": "record",
      "name": "user_session_count",
      "fields": [
        {
          "name": "session_count",
          "type": [
            "null",
            "int"
          ],
          "default": 0
        }
      ]
    },
    "fields": [
      {
        "name": "session_count",
        "title": "Session Count",
        "objectType": "int",
        "itemsType": null,
        "items": null,
        "possibleValues": null
      }
    ],
    "fieldNames": ["session_count"],
    "strategy": "count"
  }
];
