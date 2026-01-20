export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 
  | 'admin'
  | 'supplier'
  | 'distributor'
  | 'trainer'
  | 'team_member'
  | 'donor'
  | 'beneficiary';

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  budget: number;
  raised: number;
  startDate: string;
  endDate: string;
  location: string;
  thumbnail?: string;
  video?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  organizationType?: string;
  organizationId?: string;
  country?: string;
  province?: string;
  city?: string;
  projectManagerId?: string;
  operatorIds?: string[];
  templateKey?: string;
}

export type ProjectType = 'blank' | 'distribution' | 'training' | 'research';
export type ProjectStatus = 'draft' | 'active' | 'completed' | 'cancelled';

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  donorId: string;
  projectId: string;
  message?: string;
  isRecurring: boolean;
  method?: 'stripe' | 'bank_transfer' | 'mobile_money';
  status?: 'succeeded' | 'pending' | 'failed';
  createdAt: string;
}

export interface RecurringDonation {
  id: string;
  donationId?: string; // base donation reference
  donorId: string;
  projectId: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'paused' | 'cancelled';
  startedAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipient: string;
  channel: NotificationChannel[];
  read: boolean;
  createdAt: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push';

export interface NotificationPayload {
  title: string;
  message: string;
  recipients: string[];
  channel: NotificationChannel[];
  metadata?: Record<string, any>;
}

export interface Partner {
  id: string;
  name: string;
  type: 'supplier' | 'distributor' | 'trainer';
  contactEmail?: string;
  phone?: string;
  country?: string;
  active: boolean;
  createdAt: string;
}
