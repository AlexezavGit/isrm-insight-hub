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
  caseTheme?: string | undefined;
  internationalRelevance?: string | undefined;
  // revealed only
  organization?: string | undefined;
  role?: string | undefined;
  phone?: string | undefined;
  linkedin?: string | undefined;
  source?: string | undefined;
  sensitivity?: string | undefined;
}

export interface NetworkPayload {
  level: AccessLevel;
  grantedBy?: string | undefined;
  experts: Expert[];
}
