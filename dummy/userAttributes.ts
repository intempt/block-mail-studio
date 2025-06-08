
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
        "name": "account_owner",
        "attributeType": "extracted",
        "type": "account",
        "title": "Account owner",
        "description": "Intempt account owner",
        "example": "",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "account_owner",
            "fields": [
                {
                    "name": "intempt_account_owner",
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
                "name": "intempt_account_owner",
                "title": "Account owner",
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
        "id": "19",
        "name": "account_intempt_tags",
        "attributeType": "extracted",
        "type": "account",
        "title": "Account Intempt tags",
        "description": "Intempt account owner",
        "example": "",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "intempt_tags",
            "fields": [
                {
                    "name": "intempt_tags",
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
                "name": "intempt_tags",
                "title": "Account Intempt tags",
                "objectType": "array",
                "itemsType": "string",
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "intempt_tags"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995630219264",
        "name": "first_name",
        "attributeType": "extracted",
        "type": "user",
        "title": "First name",
        "description": "First name of the user.",
        "example": "John",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "first_name",
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
                "name": "first_name",
                "title": "First name",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "first_name",
            "firstname"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995630219265",
        "name": "last_name",
        "attributeType": "extracted",
        "type": "user",
        "title": "Last name",
        "description": "Last name of the user.",
        "example": "Doe",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "last_name",
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
                "name": "last_name",
                "title": "Last name",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "lastname",
            "last_name"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995634413569",
        "name": "region",
        "attributeType": "extracted",
        "type": "user",
        "title": "Region",
        "description": "Region of the user's address.",
        "example": "Greater London",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "region",
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
                "name": "region",
                "title": "Region",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "region"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995638607875",
        "name": "account_city",
        "attributeType": "extracted",
        "type": "account",
        "title": "Account city",
        "description": "City of the account's address.",
        "example": "London",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "city",
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
                "title": "Account city",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "city"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995642802178",
        "name": "industry",
        "attributeType": "extracted",
        "type": "account",
        "title": "Account Industry",
        "description": "Industry of the account.",
        "example": "eCommerce",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "industry",
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
                "name": "industry",
                "title": "Account Industry",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "industry"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995642802176",
        "name": "account_region",
        "attributeType": "extracted",
        "type": "account",
        "title": "Account region",
        "description": "Region of the account's address.",
        "example": "Greater London",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "region",
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
                "name": "region",
                "title": "Account region",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "region"
        ],
        "strategy": "last"
    },
    {
        "id": "621937576488341504",
        "name": "browser",
        "attributeType": "extracted",
        "type": "user",
        "title": "browser",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.757046Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "browser",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "browser",
                "title": "browser",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "browser"
        ],
        "strategy": "last"
    },
    {
        "id": "621937576500924416",
        "name": "devicetype",
        "attributeType": "extracted",
        "type": "user",
        "title": "deviceType",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.758514Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "deviceType",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "deviceType",
                "title": "deviceType",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "devicetype"
        ],
        "strategy": "last"
    },
    {
        "id": "621937576513507328",
        "name": "platform",
        "attributeType": "extracted",
        "type": "user",
        "title": "platform",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.760116Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "platform",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "platform",
                "title": "platform",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "platform"
        ],
        "strategy": "last"
    },
    {
        "id": "621937576530284544",
        "name": "landingpage",
        "attributeType": "extracted",
        "type": "user",
        "title": "landingPage",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.765646Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "landingPage",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "landingPage",
                "title": "landingPage",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "landingpage"
        ],
        "strategy": "last"
    },
    {
        "id": "621937576521895936",
        "name": "ipaddress",
        "attributeType": "extracted",
        "type": "user",
        "title": "ipAddress",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.761737Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "ipAddress",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "ipAddress",
                "title": "ipAddress",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "ipaddress"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995630219266",
        "name": "email",
        "attributeType": "extracted",
        "type": "user",
        "title": "Email",
        "description": "Email of the user.",
        "example": "john.doe@mail.com",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
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
        "fieldNames": [
            "email"
        ],
        "strategy": "last"
    },
    {
        "id": "621937576538673152",
        "name": "referrer",
        "attributeType": "extracted",
        "type": "user",
        "title": "referrer",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.769883Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "referrer",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "referrer",
                "title": "referrer",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "referrer"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995626024960",
        "name": "name",
        "attributeType": "extracted",
        "type": "user",
        "title": "Name",
        "description": "First name and last name are treated as a single value.",
        "example": "John Doe",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "name",
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
                "name": "name",
                "title": "Name",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "name"
        ],
        "strategy": "last"
    },
    {
        "id": "621937576547061760",
        "name": "fullreferrer",
        "attributeType": "extracted",
        "type": "user",
        "title": "fullReferrer",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.771398Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "fullReferrer",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "fullReferrer",
                "title": "fullReferrer",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "fullreferrer"
        ],
        "strategy": "last"
    },
    {
        "id": "58",
        "name": "account_picture_url",
        "attributeType": "extracted",
        "type": "account",
        "title": "Account picture url",
        "description": "Account picture url of the account.",
        "example": "",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "logo",
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
                "name": "logo",
                "title": "Account picture url",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "logo"
        ],
        "strategy": "last"
    },
    {
        "id": "621937576563838976",
        "name": "utmmedium",
        "attributeType": "extracted",
        "type": "user",
        "title": "utmMedium",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.776078Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "utmMedium",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "utmMedium",
                "title": "utmMedium",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "utmmedium"
        ],
        "strategy": "last"
    },
    {
        "id": "621937576555450368",
        "name": "utmsource",
        "attributeType": "extracted",
        "type": "user",
        "title": "utmSource",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.772724Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "utmSource",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "utmSource",
                "title": "utmSource",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "utmsource"
        ],
        "strategy": "last"
    },
    {
        "id": "621937576576421888",
        "name": "utmterm",
        "attributeType": "extracted",
        "type": "user",
        "title": "utmTerm",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.778151Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "utmTerm",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "utmTerm",
                "title": "utmTerm",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "utmterm"
        ],
        "strategy": "last"
    },
    {
        "id": "621937576597393408",
        "name": "utmcampaign",
        "attributeType": "extracted",
        "type": "user",
        "title": "utmCampaign",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.782599Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "utmCampaign",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "utmCampaign",
                "title": "utmCampaign",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "utmcampaign"
        ],
        "strategy": "last"
    },
    {
        "id": "623706283317276672",
        "name": "first_name_account",
        "attributeType": "extracted",
        "type": "account",
        "title": "first_name | account",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-14T16:29:32.302743Z",
        "createdBy": -1,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "first_name",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "first_name",
                "title": "first_name | account",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "first_name"
        ],
        "strategy": "last"
    },
    {
        "id": "623706283329859584",
        "name": "phone_account",
        "attributeType": "extracted",
        "type": "account",
        "title": "phone | account",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-14T16:29:32.305632Z",
        "createdBy": -1,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "phone",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "phone",
                "title": "phone | account",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "phone"
        ],
        "strategy": "last"
    },
    {
        "id": "623706283275333632",
        "name": "email_account",
        "attributeType": "extracted",
        "type": "account",
        "title": "email | account",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-14T16:29:32.300073Z",
        "createdBy": -1,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "email",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "email",
                "title": "email | account",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "email"
        ],
        "strategy": "last"
    },
    {
        "id": "659115004416438272",
        "name": "qa_test_rfm",
        "attributeType": "scoring",
        "type": "user",
        "title": "QA test RFM",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-08-20T09:31:09.248703Z",
        "createdBy": 1058,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "rfm",
            "namespace": "com.intempt.data.scoring",
            "fields": [
                {
                    "name": "rfm",
                    "type": [
                        {
                            "type": "record",
                            "name": "rfm_value",
                            "fields": [
                                {
                                    "name": "rfm_segment",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "At risk",
                                        "Needs attention",
                                        "Promising",
                                        "Regulars",
                                        "Champion"
                                    ]
                                },
                                {
                                    "name": "recency",
                                    "type": [
                                        "int",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "frequency",
                                    "type": [
                                        "int",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "monetary",
                                    "type": [
                                        "double",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "recency_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                },
                                {
                                    "name": "frequency_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                },
                                {
                                    "name": "monetary_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                }
                            ]
                        },
                        "null"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "rfm.recency_score",
                "title": "QA test RFM / recency_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            },
            {
                "name": "rfm.monetary_score",
                "title": "QA test RFM / monetary_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            },
            {
                "name": "rfm.rfm_segment",
                "title": "QA test RFM / rfm_segment",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "At risk",
                    "Needs attention",
                    "Promising",
                    "Regulars",
                    "Champion"
                ]
            },
            {
                "name": "rfm.recency",
                "title": "QA test RFM / recency",
                "objectType": "int",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            },
            {
                "name": "rfm.frequency_score",
                "title": "QA test RFM / frequency_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            },
            {
                "name": "rfm.frequency",
                "title": "QA test RFM / frequency",
                "objectType": "int",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            },
            {
                "name": "rfm.monetary",
                "title": "QA test RFM / monetary",
                "objectType": "double",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "timeframe": {
            "startTime": {
                "relative": {
                    "unit": "days",
                    "adjust": {
                        "days": -9
                    }
                }
            },
            "duration": {
                "days": 10
            }
        },
        "includeSpecific": null,
        "scoringAttributeType": "rfm",
        "models": [
            {
                "modelType": "recency",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "621939551548346368",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 659115004462575600
                }
            },
            {
                "modelType": "monetary",
                "collectionId": "621939551363796992",
                "fieldName": "data.price",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "621939551548346368",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 659115004462575600
                }
            },
            {
                "modelType": "frequency",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "621939551548346368",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 659115004462575600
                }
            }
        ],
        "replay": false
    },
    {
        "id": "626939648308830208",
        "name": "rfm_test",
        "attributeType": "scoring",
        "type": "user",
        "title": "RFM | TEST",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-23T14:37:46.600336Z",
        "createdBy": 1001,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "rfm",
            "namespace": "com.intempt.data.scoring",
            "fields": [
                {
                    "name": "rfm",
                    "type": [
                        {
                            "type": "record",
                            "name": "rfm_value",
                            "fields": [
                                {
                                    "name": "rfm_segment",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "At risk",
                                        "Needs attention",
                                        "Promising",
                                        "Regulars",
                                        "Champion"
                                    ]
                                },
                                {
                                    "name": "recency",
                                    "type": [
                                        "int",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "frequency",
                                    "type": [
                                        "int",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "monetary",
                                    "type": [
                                        "double",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "recency_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                },
                                {
                                    "name": "frequency_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                },
                                {
                                    "name": "monetary_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                }
                            ]
                        },
                        "null"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "rfm.monetary",
                "title": "RFM | TEST / monetary",
                "objectType": "double",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            },
            {
                "name": "rfm.monetary_score",
                "title": "RFM | TEST / monetary_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            },
            {
                "name": "rfm.recency_score",
                "title": "RFM | TEST / recency_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            },
            {
                "name": "rfm.frequency_score",
                "title": "RFM | TEST / frequency_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            },
            {
                "name": "rfm.rfm_segment",
                "title": "RFM | TEST / rfm_segment",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "At risk",
                    "Needs attention",
                    "Promising",
                    "Regulars",
                    "Champion"
                ]
            },
            {
                "name": "rfm.frequency",
                "title": "RFM | TEST / frequency",
                "objectType": "int",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            },
            {
                "name": "rfm.recency",
                "title": "RFM | TEST / recency",
                "objectType": "int",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "timeframe": {
            "startTime": {
                "relative": {
                    "unit": "days",
                    "adjust": {
                        "days": -9
                    }
                }
            },
            "duration": {
                "days": 10
            }
        },
        "includeSpecific": null,
        "scoringAttributeType": "rfm",
        "models": [
            {
                "modelType": "recency",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "626876959817621504",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 626939648363356200
                }
            },
            {
                "modelType": "monetary",
                "collectionId": "621939551363796992",
                "fieldName": "data.price",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "621939551548346368",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 626939648417882100
                }
            },
            {
                "modelType": "frequency",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "626876959817621504",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 626939648363356200
                }
            }
        ],
        "replay": true
    },
    {
        "id": "621937576584810496",
        "name": "utmcontent",
        "attributeType": "extracted",
        "type": "user",
        "title": "utmContent",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-09T19:21:19.779712Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "utmContent",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "utmContent",
                "title": "utmContent",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "utmcontent"
        ],
        "strategy": "last"
    },
    {
        "id": "20",
        "name": "intempt_tags",
        "attributeType": "extracted",
        "type": "user",
        "title": "Intempt tags",
        "description": "Intempt account owner",
        "example": "",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "intempt_tags",
            "fields": [
                {
                    "name": "intempt_tags",
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
                "name": "intempt_tags",
                "title": "Intempt tags",
                "objectType": "array",
                "itemsType": "string",
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "intempt_tags"
        ],
        "strategy": "last"
    },
    {
        "id": "650263884382248960",
        "name": "rfm_model_2_",
        "attributeType": "scoring",
        "type": "user",
        "title": "RFM model (2)",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-07-26T23:19:57.838807Z",
        "createdBy": 1003,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "rfm",
            "namespace": "com.intempt.data.scoring",
            "fields": [
                {
                    "name": "rfm",
                    "type": [
                        {
                            "type": "record",
                            "name": "rfm_value",
                            "fields": [
                                {
                                    "name": "rfm_segment",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "At risk",
                                        "Needs attention",
                                        "Promising",
                                        "Regulars",
                                        "Champion"
                                    ]
                                },
                                {
                                    "name": "recency",
                                    "type": [
                                        "int",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "frequency",
                                    "type": [
                                        "int",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "monetary",
                                    "type": [
                                        "double",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "recency_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                },
                                {
                                    "name": "frequency_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                },
                                {
                                    "name": "monetary_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                }
                            ]
                        },
                        "null"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "rfm.recency",
                "title": "RFM model (2) / recency",
                "objectType": "int",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            },
            {
                "name": "rfm.monetary_score",
                "title": "RFM model (2) / monetary_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            },
            {
                "name": "rfm.rfm_segment",
                "title": "RFM model (2) / rfm_segment",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "At risk",
                    "Needs attention",
                    "Promising",
                    "Regulars",
                    "Champion"
                ]
            },
            {
                "name": "rfm.recency_score",
                "title": "RFM model (2) / recency_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            },
            {
                "name": "rfm.frequency",
                "title": "RFM model (2) / frequency",
                "objectType": "int",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            },
            {
                "name": "rfm.monetary",
                "title": "RFM model (2) / monetary",
                "objectType": "double",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            },
            {
                "name": "rfm.frequency_score",
                "title": "RFM model (2) / frequency_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            }
        ],
        "timeframe": {
            "startTime": {
                "relative": {
                    "unit": "days",
                    "adjust": {
                        "days": -179
                    }
                }
            },
            "duration": {
                "days": 180
            }
        },
        "includeSpecific": null,
        "scoringAttributeType": "rfm",
        "models": [
            {
                "modelType": "recency",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "627354044386402304",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 650263884482912300
                }
            },
            {
                "modelType": "monetary",
                "collectionId": "627354043631427584",
                "fieldName": "data.order_total",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "627354044386402304",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 650263884482912300
                }
            },
            {
                "modelType": "frequency",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "627354044386402304",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 650263884482912300
                }
            }
        ],
        "replay": false
    },
    {
        "id": "626205214051831808",
        "name": "rfm_model",
        "attributeType": "scoring",
        "type": "user",
        "title": "RFM Model",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-23T12:06:53.264485Z",
        "createdBy": 1000,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "rfm",
            "namespace": "com.intempt.data.scoring",
            "fields": [
                {
                    "name": "rfm",
                    "type": [
                        {
                            "type": "record",
                            "name": "rfm_value",
                            "fields": [
                                {
                                    "name": "rfm_segment",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "At risk",
                                        "Needs attention",
                                        "Promising",
                                        "Regulars",
                                        "Champion"
                                    ]
                                },
                                {
                                    "name": "recency",
                                    "type": [
                                        "int",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "frequency",
                                    "type": [
                                        "int",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "monetary",
                                    "type": [
                                        "double",
                                        "null"
                                    ],
                                    "hidden": true
                                },
                                {
                                    "name": "recency_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                },
                                {
                                    "name": "frequency_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                },
                                {
                                    "name": "monetary_score",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Lowest",
                                        "Low",
                                        "Medium",
                                        "High",
                                        "Highest"
                                    ]
                                }
                            ]
                        },
                        "null"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "rfm.monetary_score",
                "title": "RFM Model / monetary_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            },
            {
                "name": "rfm.recency_score",
                "title": "RFM Model / recency_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            },
            {
                "name": "rfm.frequency_score",
                "title": "RFM Model / frequency_score",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Lowest",
                    "Low",
                    "Medium",
                    "High",
                    "Highest"
                ]
            },
            {
                "name": "rfm.rfm_segment",
                "title": "RFM Model / rfm_segment",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "At risk",
                    "Needs attention",
                    "Promising",
                    "Regulars",
                    "Champion"
                ]
            },
            {
                "name": "rfm.monetary",
                "title": "RFM Model / monetary",
                "objectType": "double",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            },
            {
                "name": "rfm.frequency",
                "title": "RFM Model / frequency",
                "objectType": "int",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            },
            {
                "name": "rfm.recency",
                "title": "RFM Model / recency",
                "objectType": "int",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "timeframe": {
            "startTime": {
                "relative": {
                    "unit": "days",
                    "adjust": {
                        "days": -9
                    }
                }
            },
            "duration": {
                "days": 10
            }
        },
        "includeSpecific": null,
        "scoringAttributeType": "rfm",
        "models": [
            {
                "modelType": "recency",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "621937577524334592",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 626854231295287300
                }
            },
            {
                "modelType": "monetary",
                "collectionId": "621939551363796992",
                "fieldName": "data.price",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "621939551548346368",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 626205214110552000
                }
            },
            {
                "modelType": "frequency",
                "filter": {
                    "filter": {
                        "$or": [
                            {
                                "$event": {
                                    "eventId": "621938466330906624",
                                    "filter": null
                                }
                            }
                        ]
                    },
                    "segmentId": 626205214127329300
                }
            }
        ],
        "replay": true
    },
    {
        "id": "661379303591591936",
        "name": "fssdfsdfsdf",
        "attributeType": "scoring",
        "type": "user",
        "title": "fssdfsdfsdf",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-08-26T15:28:40.254517Z",
        "createdBy": 1001,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "fa",
            "namespace": "com.intempt.data.scoring",
            "fields": [
                {
                    "name": "fa",
                    "type": [
                        {
                            "type": "record",
                            "name": "fa_value",
                            "fields": [
                                {
                                    "name": "fit",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Low",
                                        "Medium",
                                        "High"
                                    ]
                                },
                                {
                                    "name": "activity",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Low",
                                        "Medium",
                                        "High"
                                    ]
                                }
                            ]
                        },
                        "null"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "fa.fit",
                "title": "fssdfsdfsdf / fit",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Low",
                    "Medium",
                    "High"
                ]
            },
            {
                "name": "fa.activity",
                "title": "fssdfsdfsdf / activity",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Low",
                    "Medium",
                    "High"
                ]
            }
        ],
        "timeframe": {
            "startTime": {
                "relative": {
                    "unit": "days",
                    "adjust": {
                        "days": -9
                    }
                }
            },
            "duration": {
                "days": 10
            }
        },
        "includeSpecific": null,
        "scoringAttributeType": "fa",
        "models": [
            {
                "modelType": "fit",
                "filters": [
                    {
                        "filter": {
                            "$or": [
                                {
                                    "$and": [
                                        {
                                            "$userAttribute": {
                                                "attributeId": "621928995630219266",
                                                "filter": {
                                                    "email": {
                                                        "$ne": null
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        "segmentId": 661379303658700800,
                        "weight": 100
                    }
                ],
                "mappings": [
                    {
                        "from": 0,
                        "to": 49,
                        "value": "Low"
                    },
                    {
                        "from": 50,
                        "to": 79,
                        "value": "Medium"
                    },
                    {
                        "from": 80,
                        "to": 100,
                        "value": "High"
                    }
                ]
            },
            {
                "modelType": "activity",
                "filters": [
                    {
                        "filter": {
                            "$or": [
                                {
                                    "$and": [
                                        {
                                            "$event": {
                                                "eventId": "624074923191463936",
                                                "filter": null
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        "segmentId": 661379303700643800,
                        "weight": 100,
                        "decayPercent": 100,
                        "decayDays": 0
                    }
                ],
                "mappings": [
                    {
                        "from": 0,
                        "to": 49,
                        "value": "Low"
                    },
                    {
                        "from": 50,
                        "to": 79,
                        "value": "Medium"
                    },
                    {
                        "from": 80,
                        "to": 100,
                        "value": "High"
                    }
                ]
            }
        ],
        "replay": false
    },
    {
        "id": "621928995634413570",
        "name": "postal_code",
        "attributeType": "extracted",
        "type": "user",
        "title": "Postal code",
        "description": "Postal code of the user's address.",
        "example": "91-302",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "postal_code",
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
                "name": "postal_code",
                "title": "Postal code",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "postal_code",
            "postalcode"
        ],
        "strategy": "last"
    },
    {
        "id": "623706283325665280",
        "name": "last_name_account",
        "attributeType": "extracted",
        "type": "account",
        "title": "last_name | account",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2024-05-14T16:29:32.304202Z",
        "createdBy": -1,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "attribute",
            "fields": [
                {
                    "name": "last_name",
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "last_name",
                "title": "last_name | account",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "last_name"
        ],
        "strategy": "last"
    },
    {
        "id": "1431242352256372736",
        "name": "link",
        "attributeType": "extracted",
        "type": "user",
        "title": "Link",
        "description": "",
        "example": "",
        "active": true,
        "lastUpdated": "2025-01-23T07:46:30.409140Z",
        "createdBy": 1006,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "fields": [],
        "fieldNames": [
            "linkedin"
        ],
        "strategy": "first"
    },
    {
        "id": "1528556874679263232",
        "name": "added_to_cart_likelihood",
        "attributeType": "predicted",
        "type": "user",
        "title": "added_to_cart Likelihood",
        "description": "Generated attribute for prediction task",
        "active": true,
        "lastUpdated": "2025-06-06T14:13:05.487656Z",
        "createdBy": 1001,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "audience_ai",
            "fields": [
                {
                    "name": "audience_ai",
                    "type": [
                        {
                            "type": "record",
                            "name": "audience_ai_value",
                            "fields": [
                                {
                                    "name": "nba",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": []
                                },
                                {
                                    "name": "likelihood",
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "possibleValues": [
                                        "Low",
                                        "Medium",
                                        "High"
                                    ]
                                }
                            ]
                        },
                        "null"
                    ]
                }
            ]
        },
        "fields": [
            {
                "name": "audience_ai.likelihood",
                "title": "added_to_cart Likelihood / likelihood",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": [
                    "Low",
                    "Medium",
                    "High"
                ]
            },
            {
                "name": "audience_ai.nba",
                "title": "added_to_cart Likelihood / nba",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": []
            }
        ],
        "taskId": 1528556874435993600
    },
    {
        "id": "621928995638607872",
        "name": "country",
        "attributeType": "extracted",
        "type": "user",
        "title": "Country",
        "description": "Country of the user's address.",
        "example": "Poland",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
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
                "name": "country",
                "title": "Country",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "country"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995630219267",
        "name": "phone_number",
        "attributeType": "extracted",
        "type": "user",
        "title": "Phone number",
        "description": "Phone number of the user.",
        "example": "+48881293821234",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "phone",
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
                "name": "phone",
                "title": "Phone number",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "phone",
            "phone_number",
            "phoneNumber"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995634413568",
        "name": "city",
        "attributeType": "extracted",
        "type": "user",
        "title": "City",
        "description": "City of the user's address.",
        "example": "London",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "city",
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
            }
        ],
        "fieldNames": [
            "city"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995638607874",
        "name": "account_postal_code",
        "attributeType": "extracted",
        "type": "account",
        "title": "Account postal code",
        "description": "Postal code of the account's address.",
        "example": "91-302",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "postal_code",
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
                "name": "postal_code",
                "title": "Account postal code",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "postal_code",
            "postalcode"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995638607873",
        "name": "account_country",
        "attributeType": "extracted",
        "type": "account",
        "title": "Account country",
        "description": "Country of the account's address.",
        "example": "Poland",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
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
                "name": "country",
                "title": "Account country",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "country"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995642802177",
        "name": "website",
        "attributeType": "extracted",
        "type": "account",
        "title": "Account Website",
        "description": "Website of the account.",
        "example": "intempt.com",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "website",
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
                "name": "website",
                "title": "Account Website",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "website"
        ],
        "strategy": "last"
    },
    {
        "id": "621928995642802179",
        "name": "account_name",
        "attributeType": "extracted",
        "type": "account",
        "title": "Account name",
        "description": "Name of the account.",
        "example": "Intempt",
        "active": true,
        "segmentationAvailable": true,
        "pii": true,
        "unique": true,
        "schema": {
            "type": "record",
            "name": "schema",
            "fields": [
                {
                    "name": "name",
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
                "name": "name",
                "title": "Account name",
                "objectType": "string",
                "itemsType": null,
                "items": null,
                "possibleValues": null
            }
        ],
        "fieldNames": [
            "name"
        ],
        "strategy": "last"
    }
]