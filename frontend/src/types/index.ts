// ===== User =====
export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

// ===== Inspiration =====
export type InspirationType = "link" | "image" | "code" | "note" | "html" | "css";
export type Domain = "design" | "dev" | "product";

export interface Inspiration {
  id: number;
  userId: number;
  title: string;
  type: InspirationType;
  content: string;
  domain: Domain[];
  tags: string[];
  notes?: string;
  language?: string;
  sourceUrl?: string;
  imageThumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspirationCreate {
  title: string;
  type: InspirationType;
  content: string;
  domain: Domain[];
  tags?: string[];
  notes?: string;
  language?: string;
  sourceUrl?: string;
}

export interface InspirationUpdate {
  title?: string;
  content?: string;
  domain?: Domain[];
  tags?: string[];
  notes?: string;
  language?: string;
  sourceUrl?: string;
}

// ===== API Response =====
export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// ===== Auth =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ===== Tags =====
export interface TagCount {
  name: string;
  count: number;
}

// ===== Filter =====
export interface FilterState {
  types: InspirationType[];
  domains: Domain[];
  tags: string[];
  search: string;
}
