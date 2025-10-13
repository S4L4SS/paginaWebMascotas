"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminPanel from "../../components/AdminPanel";

export default function AdminPage() {
  const router = useRouter();
  // Supón que tienes el rol en localStorage o contexto
  useEffect(() => {
    const rol = localStorage.getItem("rol");
    if (rol !== "admin") {
      router.push("/login");
    }
  }, [router]);
  return <AdminPanel />;
}
