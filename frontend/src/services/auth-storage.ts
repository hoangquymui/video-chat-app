import type { User } from "../types/user.type";

export const AUTH_CHANGED_EVENT = "auth-changed";

function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function getStoredUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem("user") || "null") as User | null;
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    return null;
  }
}

export function clearAuthStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  notifyAuthChanged();
}

export function setAuthStorage(accessToken: string, user: User) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", JSON.stringify(user));
  notifyAuthChanged();
}
