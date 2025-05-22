"use client"
import { useMsal } from "@azure/msal-react";

export default function AuthButton() {
  const { instance, accounts } = useMsal();
  if (accounts.length > 0) {
    return <button onClick={() => instance.logoutRedirect()}>サインアウト</button>;
  }
  return <button onClick={() => instance.loginRedirect()}>サインイン</button>;
} 