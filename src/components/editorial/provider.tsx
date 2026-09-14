"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { mergeEditorial, type EditorialOverrides } from "@/lib/editorial/merge";
const EditorialContext = createContext<EditorialOverrides>({});
export function EditorialProvider({ values, children }: { values: EditorialOverrides; children: ReactNode }) {
  return <EditorialContext.Provider value={values}>{children}</EditorialContext.Provider>;
}
export function useEditorial<T>(key: string, defaults: T): T {
  const values = useContext(EditorialContext);
  return useMemo(() => mergeEditorial(defaults, values[key]), [defaults, values, key]);
}
