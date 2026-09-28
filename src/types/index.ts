export type ItemType = 'lost' | 'found';

export type ItemStatus = 'active' | 'reunited';

export type ItemCategory =
  | 'Electronics'
  | 'IDs & Cards'
  | 'Keys'
  | 'Bags & Backpacks'
  | 'Clothing & Wearables'
  | 'Books & Supplies'
  | 'Bottles & Tumblers'
  | 'Jewelry & Accessories'
  | 'Other';

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  preferredMethod: 'email' | 'phone' | 'in_app';
  studentIdLast4?: string;
  affiliation?: 'Undergraduate' | 'Graduate' | 'Faculty' | 'Staff' | 'Campus Guest';
}

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  category: ItemCategory;
  description: string;
  location: string;
  specificLocation?: string;
  date: string; // YYYY-MM-DD
  imageUrl?: string;
  status: ItemStatus;
  contact: ContactInfo;
  distinctiveFeatures?: string;
  createdAt: number;
}

export interface MatchScoreFactors {
  categoryScore: number;
  textSimilarityScore: number;
  locationScore: number;
  dateProximityScore: number;
}

export interface MatchResult {
  lostItem: Item;
  foundItem: Item;
  overallScore: number; // 0 - 100
  confidenceLevel: 'High' | 'Medium' | 'Low';
  explanation: string;
  factors: MatchScoreFactors;
  matchedKeywords: string[];
}

export type ActivePage = 'home' | 'browse' | 'report' | 'matches' | 'locations';
