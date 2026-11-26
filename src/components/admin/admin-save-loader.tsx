"use client";

import { useFormStatus } from "react-dom";
import FormLoader from "@/components/forms/form-loader";

export default function AdminSaveLoader() {
  const { pending } = useFormStatus();
  return <FormLoader active={pending} label="Saving changes..." />;
}
