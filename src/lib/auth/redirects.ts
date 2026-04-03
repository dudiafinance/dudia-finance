import { redirect } from "next/navigation";

export const redirects = {
  login: () => redirect("/login"),
  dashboard: () => redirect("/dashboard"),
};