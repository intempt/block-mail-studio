
export interface User {
  profile: string;
  identifier: string;
  lastSeen: string;
}

export interface UserAttribute {
  name: string;
  displayName: string;
  description: string;
  valueType: string;
  type: string;
  category: string;
}

export interface UserDetails {
  firstSeen: string;
  lastSeen: string;
  identifiers: string[];
  totalEvents: number;
  sources: string[];
  segments: Record<string, boolean>;
  segmentQueryIds: number[];
  attributes: UserDetailAttribute[];
}

export interface UserDetailAttribute {
  attrId: string;
  title: string;
  value: any;
  lastUpdated?: string;
}

export interface VariableOption {
  text: string;
  description: string;
}
