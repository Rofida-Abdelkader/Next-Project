// types/index.ts
export interface IUser {
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    name: string;
    email: string;
  };
  error?: string;
}