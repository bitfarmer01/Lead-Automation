export interface Entry {
  id: number;
  jobRole: string;
  location: string;
  experienceLevel: string;
  dateRange: string;
  linkedinUrl: string;
}

export interface WebhookResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

export interface SavedWebhook {
  name: string;
  url: string;
}

export interface SavedSet {
  name: string;
  entries: Entry[];
}