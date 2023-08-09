"use client";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    redirect("/accounts");
  } else {
    redirect("/login");
  }
}
