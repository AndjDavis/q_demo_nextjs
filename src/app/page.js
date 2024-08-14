import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authConfig } from "./lib/auth"
import { CredentialsForm } from "./components/credentialsForm";
import { GoogleSignInButton, GithubSignInButton } from "./components/authButton";

export default async function SignInPage() {
  try {
    const session = await getServerSession(authConfig);
    // TODO: redirect to home;
    // TODO: Create home screen;
    if (session) return redirect("/dashboard");
  } catch (error) {
    console.log("session error", error)
  }


  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center mt-10 p-10 shadow-md">
        <h1 className="mt-10 mb-4 text-4xl font-bold">Sign In</h1>
        <CredentialsForm />
        <span className="text-2xl font-semibold text-white text-center mt-8">
          Or
        </span>
        <GoogleSignInButton />
        <GithubSignInButton />
      </div>
    </div>
  );
}
