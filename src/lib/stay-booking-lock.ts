import { isLocalDb } from "@/lib/db";
// Shared single-process queue for the local embedded database, including HMR.
const state=globalThis as typeof globalThis & {vinyasaStayWrite?:Promise<unknown>};
export function withStayBookingLock<T>(run:()=>Promise<T>):Promise<T>{if(!isLocalDb())return run();const next=(state.vinyasaStayWrite||Promise.resolve()).then(run,run);state.vinyasaStayWrite=next.catch(()=>{});return next;}
