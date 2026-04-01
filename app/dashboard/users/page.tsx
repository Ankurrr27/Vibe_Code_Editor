import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { OWNER_EMAIL, canViewUsersPage } from "@/lib/access";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await auth();

  if (!canViewUsersPage(session?.user)) {
    redirect("/dashboard");
  }

  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          myPlayground: true,
          accounts: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#e93f3f]">
          App Usage
        </p>
        <h1 className="text-3xl font-black text-zinc-950 dark:text-white">
          User-wise app activity
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Track who signed in, how many playgrounds they created, and which
          accounts are connected. Access is reserved for admin users and the
          owner email `{OWNER_EMAIL}`.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-black/10 bg-white/85 dark:border-white/10 dark:bg-zinc-950/80">
          <CardContent className="space-y-2 p-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total users</p>
            <p className="text-3xl font-black text-zinc-950 dark:text-white">
              {users.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-black/10 bg-white/85 dark:border-white/10 dark:bg-zinc-950/80">
          <CardContent className="space-y-2 p-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Connected accounts</p>
            <p className="text-3xl font-black text-zinc-950 dark:text-white">
              {users.reduce((sum, user) => sum + user._count.accounts, 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-black/10 bg-white/85 dark:border-white/10 dark:bg-zinc-950/80">
          <CardContent className="space-y-2 p-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Playgrounds created</p>
            <p className="text-3xl font-black text-zinc-950 dark:text-white">
              {users.reduce((sum, user) => sum + user._count.myPlayground, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-black/10 bg-white/90 dark:border-white/10 dark:bg-zinc-950/85">
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.03]">
              <tr className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Accounts</th>
                <th className="px-5 py-4">Playgrounds</th>
                <th className="px-5 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-black/5 text-sm text-zinc-700 last:border-b-0 dark:border-white/5 dark:text-zinc-300"
                >
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-zinc-950 dark:text-white">
                        {user.name || "Unnamed user"}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">{user.role}</td>
                  <td className="px-5 py-4">{user._count.accounts}</td>
                  <td className="px-5 py-4">{user._count.myPlayground}</td>
                  <td className="px-5 py-4">
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                    }).format(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
