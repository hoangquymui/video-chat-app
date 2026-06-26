export type UserRole = "admin" | "user";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
};
