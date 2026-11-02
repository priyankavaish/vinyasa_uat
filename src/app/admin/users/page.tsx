import {redirect} from "next/navigation";
import {getSessionUser} from "@/lib/auth-server";
import {getDb} from "@/lib/db";
import {adminUsers} from "@/lib/db/schema";
import AddUserForm from "@/components/admin/add-user-form";
import UsersTable from "@/components/admin/users-table";
export const dynamic="force-dynamic";
export default async function UsersPage(){
 if(!await getSessionUser())redirect("/admin/login");
 const users=await getDb().select({id:adminUsers.id,email:adminUsers.email,createdAt:adminUsers.createdAt}).from(adminUsers);
 return <div><h1 className="font-display text-4xl">Users</h1><p className="mt-2 text-sm text-foreground-soft">Manage administrator accounts.</p><AddUserForm/><UsersTable users={users.map(user=>({id:user.id,email:user.email,createdAt:user.createdAt.toISOString()}))}/></div>;
}
