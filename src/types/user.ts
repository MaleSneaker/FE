export interface IUser {
  _id: string;
  email: string;
  phone: string;
  role: string;
  userName: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  blocked?: {
    isBlocked: boolean;
    by: string;
    description?: string;
  };
}
