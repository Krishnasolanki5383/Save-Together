export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  flatNumber: string;
  buildingBlock?: string;
  societyId?: string | null;
  society?: Society | null;
  role: 'MEMBER' | 'ADMIN';
  totalSavings: number;
  joinedActivitiesCount?: number;
  createdRequestsCount?: number;
  completedDealsCount?: number;
}

export interface Society {
  _id: string;
  name: string;
  city: string;
  locality: string;
  address?: string;
  inviteCode: string;
  createdBy: string;
  memberCount: number;
  totalSocietySavings: number;
  activeDealsCount?: number;
  isVerified?: boolean;
}

export interface Participant {
  userId: string;
  name: string;
  flatNumber: string;
  joinedAt?: string;
}

export interface Quote {
  _id: string;
  providerName: string;
  pricePerPerson: number;
  rating: number;
  notes?: string;
  votes: string[];
}

export interface StructuredComment {
  _id?: string;
  userId: string;
  userName: string;
  flatNumber: string;
  presetText: string;
  createdAt?: string;
}

export type RequestStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'COLLECTING_MEMBERS'
  | 'TARGET_REACHED'
  | 'QUOTE_REQUESTED'
  | 'DEAL_CONFIRMED'
  | 'SERVICE_SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ServiceRequest {
  _id: string;
  societyId: string;
  createdBy: string;
  createdByName: string;
  createdByFlat: string;
  title: string;
  category: string;
  description: string;
  targetMembers: number;
  participantCount: number;
  participants: Participant[];
  preferredDate: string;
  preferredTime: string;
  estimatedIndividualPrice: number;
  estimatedGroupPrice: number;
  finalPrice?: number | null;
  status: RequestStatus;
  quotes?: Quote[];
  selectedProvider?: string | null;
  structuredComments?: StructuredComment[];
  isHighDemand?: boolean;
  createdAt: string;
}

export interface PollOption {
  _id: string;
  text: string;
  voteCount: number;
  votes: string[];
}

export interface Poll {
  _id: string;
  societyId: string;
  createdBy: string;
  createdByName: string;
  requestId?: string | null;
  question: string;
  options: PollOption[];
  totalVotes: number;
  voterIds: string[];
  status: 'OPEN' | 'CLOSED';
  winningOption?: string | null;
  expiresAt?: string;
  createdAt: string;
}

export interface Announcement {
  _id: string;
  societyId: string;
  createdBy: string;
  createdByName: string;
  title: string;
  content: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  acknowledgements: string[];
  ackCount: number;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  societyId: string;
  type: 'REQUEST' | 'POLL' | 'DEAL' | 'SOCIETY';
  title: string;
  body: string;
  relatedId?: string | null;
  read: boolean;
  createdAt: string;
}
