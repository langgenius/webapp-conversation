"use client"
import { useMsal } from "@azure/msal-react";
import AuthButton from "./AuthButton";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { accounts } = useMsal();
  if (accounts.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
        <p>サインインが必要です</p>
        <AuthButton />
      </div>
    );
  }
  return <>{children}</>;
} 