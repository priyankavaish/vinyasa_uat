"use client";
import { useState } from "react";
import Pager, { paginate } from "@/components/admin/pager";
type UserRow = { id: string; email: string; createdAt: string };
export default function UsersTable({ users }: { users: UserRow[] }) {
  const [page, setPage] = useState(1);
  const { current, pageCount, offset, visible } = paginate(users, page, 10);
  return <><div className="mt-8 overflow-x-auto border border-line bg-white"><table className="w-full text-left text-sm"><thead><tr className="border-b border-line"><th className="p-4">Email</th><th className="p-4">Access</th><th className="p-4">Added</th></tr></thead><tbody>{visible.map(user => <tr key={user.id} className="border-b border-line"><td className="p-4">{user.email}</td><td className="p-4">Administrator</td><td className="p-4">{user.createdAt.slice(0, 10)}</td></tr>)}</tbody></table></div><Pager label="users" total={users.length} offset={offset} shown={visible.length} current={current} pageCount={pageCount} onPage={setPage} /></>;
}
