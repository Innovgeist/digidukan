import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-slate-400 mt-1">Log in to your DigiDukan account</p>
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
