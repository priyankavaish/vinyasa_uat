import {redirect} from "next/navigation";
import {getSessionUser} from "@/lib/auth-server";
import {getDb} from "@/lib/db";
import {adminUsers} from "@/lib/db/schema";
import AddUserForm from "@/components/admin/add-user-form";
export const dynamic="force-dynamic";
export default async function UsersPage(){
 if(!await getSessionUser())redirect("/admin/login");
 const users=await getDb().select({id:adminUsers.id,email:adminUsers.email,createdAt:adminUsers.createdAt}).from(adminUsers);
 return <div><h1 className="font-display text-4xl">Users</h1><p className="mt-2 text-sm text-foreground-soft">Manage administrator accounts.</p><AddUserForm/><div className="mt-8 overflow-x-auto border border-line bg-white"><table className="w-full text-left text-sm"><thead><tr className="border-b border-line"><th className="p-4">Email</th><th className="p-4">Access</th><th className="p-4">Added</th></tr></thead><tbody>{users.map(user=><tr key={user.id} className="border-b border-line"><td className="p-4">{user.email}</td><td className="p-4">Administrator</td><td className="p-4">{user.createdAt.toISOString().slice(0,10)}</td></tr>)}</tbody></table></div></div>;
}
