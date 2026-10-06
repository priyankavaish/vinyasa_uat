import {Suspense} from "react";
import PasswordRecoveryForm from "@/components/admin/password-recovery-form";
export const metadata={robots:{index:false,follow:false},referrer:"no-referrer"};
export default function Page(){return <section className="flex min-h-screen items-center justify-center bg-[#f7f1e7] px-5 py-16"><Suspense fallback={null}><PasswordRecoveryForm /></Suspense></section>;}
