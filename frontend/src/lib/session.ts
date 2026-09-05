import { useEffect, useState } from "react";

export type Role = "admin" | "inspector";

const KEY = "shristified-role";

export function setRole(role: Role) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, role);
}

export function readRole(): Role {
  if (typeof window === "undefined") return "admin";
  return (window.localStorage.getItem(KEY) as Role) ?? "admin";
}

export function useRole() {
  const [role, setRoleState] = useState<Role>("admin");
  useEffect(() => {
    setRoleState(readRole());
  }, []);
  return role;
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: "District Admin",
  inspector: "Field Inspector",
};

export const ROLE_NAME: Record<Role, string> = {
  admin: "Admin",
  inspector: "Inspector",
};

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
