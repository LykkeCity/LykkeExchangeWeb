export interface PersonalData {
  FullName: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Country: string;
  Address: string;
  City: string;
  Zip: string;
}

export interface RegistrationResponse {
  KycStatus: string;
  PinIsEntered: boolean;
  PersonalData: PersonalData;
}

export interface Answer {
  Id: string;
  Text: string;
}

export interface Questionnaire {
  Index: number;
  Id: string;
  Text: string;
  Type: string;
  Required: boolean;
  HasOther: boolean;
  Answers: Answer[];
}

export interface CurrentTier {
  Tier: string;
  Asset: string;
  Current: number;
  MaxLimit: number;
}

export interface NextTier {
  Tier: string;
  MaxLimit: number;
  Documents: DocumentType[];
}

export interface UpgradeRequest {
  Tier: string;
  SubmitDate: Date;
  Status: string;
  Limit: number;
}

export interface TierInfo {
  CurrentTier: CurrentTier;
  NextTier: NextTier;
  UpgradeRequest?: UpgradeRequest;
  QuestionnaireAnswered: boolean;
}

export type DocumentType = 'PoI' | 'PoA' | 'PoF' | 'Selfie';
export type IdCardType = 'Passport' | 'Id' | 'DrivingLicense';
export type VerificationStatus =
  | 'APPROVED'
  | 'EMPTY'
  | 'REJECTED'
  | 'SUBMITTED';

export interface Document {
  Id: string;
  Type: string;
  Status: string;
  RejectReason: string;
  Files: File[];
}

export interface File {
  Id: string;
  Type: string;
  Title?: any;
  ContentType: string;
  FileName: string;
}

export interface Documents {
  [key: string]: Document | null;
}
