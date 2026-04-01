export const OWNER_EMAIL =
  process.env.OWNER_EMAIL ?? "ankurp22singh@gmail.com";

export const canViewUsersPage = (user?: {
  email?: string | null;
  role?: string | null;
}) =>
  !!user &&
  (user.role === "ADMIN" || user.email?.toLowerCase() === OWNER_EMAIL);
