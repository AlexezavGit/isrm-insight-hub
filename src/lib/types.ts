export type AccessLevel = "guest" | "referral" | "coordinator";

export interface Expert {
  id: number;
  code: string;
  displayName: string; // pseudonym in guest mode, real name otherwise
  sector: string;
  country: string;
  identityStatus: string;
  verified: boolean;
  confidence: string;
  communityRole: string;
  crmStage: string;
  priority: string;
  tags: string[];
  primaryExpertise: string;
  ukraineTheme: string; // category (guest) or full text
  ukraineCategory: string;
  evidence: string;
  contribution: string;
  potentialRole: string;
  trust: number;
  caseTheme?: string;
  internationalRelevance?: string;
  // revealed only
  organization?: string;
  role?: string;
  phone?: string;
  linkedin?: string;
  source?: string;
  sensitivity?: string;
}

export interface NetworkPayload {
  level: AccessLevel;
  grantedBy?: string;
  experts: Expert[];
}
