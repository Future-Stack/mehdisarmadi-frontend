"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { useLogin, useAdminLogin } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants";
import Logo from "../../../../public/Images/Renofield.png";
import { ArrowLeft, Shield } from "lucide-react";
import Image from "next/image";

export default function LoginForm() {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { login, isLoading } = useLogin();
  const { adminLogin, isLoading: isAdminLoading } = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (isAdminLogin) {
      await adminLogin(data.email, data.password);
    } else {
      await login(data.email, data.password);
    }
  };

  const toggleLoginMode = () => {
    setIsAdminLogin(!isAdminLogin);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 "
      noValidate
    >
      <div className="flex flex-col items-center gap-6 text-center">
        {/* <Logo /> */}
        <Image
          src={Logo}
          alt="logo"
          // height={195}
          // width={390}
          className="w-[120px] md:w-[240px] h-auto object-contain"
          // style={{ width: "auto", height: "auto" }}
        />
        <div className="space-y-1 -mt-8">
          <div className="flex items-center justify-center gap-2">
            {isAdminLogin && <Shield size={24} className="text-purple-600" />}
            <h1 className="text-[32px] font-bold text-[#000000]">
              {isAdminLogin ? "Admin Login" : "Welcome Back"}
            </h1>
          </div>
          <p className="text-[16px] text-[#4A5565] font-medium">
            {isAdminLogin ? "Access admin dashboard" : "Login to manage your tender projects"}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          id="login-email"
          placeholder="Enter your email address"
          autoComplete="email"
          error={errors.email?.message}
          required
          className="h-12 rounded-xl border-gray-200"
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          id="login-password"
          placeholder="Enter your Password"
          autoComplete="current-password"
          error={errors.password?.message}
          required
          className="h-12 rounded-xl border-gray-200"
          {...register("password")}
        />
      </div>

      <div className="">
        <Button
          type="submit"
          id="login-submit"
          isLoading={isAdminLogin ? isAdminLoading : isLoading}
          loadingText={isAdminLogin ? "Admin login..." : "Signing in…"}
          className="w-full h-12 rounded-xl font-bold text-base"
        >
          {isAdminLogin ? "Admin Login" : "Login"}
        </Button>

        {/* <button
          type="button"
          onClick={toggleLoginMode}
          className="w-full text-sm font-medium text-gray-500 hover:text-[#059669] transition-colors py-2 rounded-xl hover:bg-gray-50"
        >
          {isAdminLogin ? "← Back to User Login" : "Admin Login →"}
        </button> */}

        <div className="flex flex-col items-center gap-4 mt-5">
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-[#009966] font-semibold hover:underline"
          >
            Forgot Password?
          </Link>

          <p className="text-sm text-gray-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="font-bold text-[#009966] hover:underline ml-1"
            >
              Sign Up
            </Link>
          </p>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#059669] font-medium transition-colors mt-2 mt-7"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          {/* <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 w-full">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 text-center">
              {isAdminLogin ? "Admin Test Account" : "Default Credentials"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {!isAdminLogin && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const email = document.getElementById('login-email') as HTMLInputElement;
                      const pass = document.getElementById('login-password') as HTMLInputElement;
                      if (email && pass) {
                        email.value = "user@renofield.com";
                        pass.value = "password123";
                        email.dispatchEvent(new Event('input', { bubbles: true }));
                        pass.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                    }}
                    className="px-3 py-2 bg-white rounded-xl border border-emerald-100 text-[11px] font-bold text-gray-600 hover:bg-emerald-100 transition-all"
                  >
                    Sub-User
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminLogin(true);
                      const email = document.getElementById('login-email') as HTMLInputElement;
                      const pass = document.getElementById('login-password') as HTMLInputElement;
                      if (email && pass) {
                        setTimeout(() => {
                          email.value = "gorimo2418@disiok.com";
                          pass.value = "adminPassword123";
                          email.dispatchEvent(new Event('input', { bubbles: true }));
                          pass.dispatchEvent(new Event('input', { bubbles: true }));
                        }, 100);
                      }
                    }}
                    className="px-3 py-2 bg-white rounded-xl border border-emerald-100 text-[11px] font-bold text-gray-600 hover:bg-emerald-100 transition-all"
                  >
                    Switch to Admin
                  </button>
                </>
              )}
              {isAdminLogin && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminLogin(false);
                    const email = document.getElementById('login-email') as HTMLInputElement;
                    const pass = document.getElementById('login-password') as HTMLInputElement;
                    if (email && pass) {
                      setTimeout(() => {
                        email.value = "user@renofield.com";
                        pass.value = "password123";
                        email.dispatchEvent(new Event('input', { bubbles: true }));
                        pass.dispatchEvent(new Event('input', { bubbles: true }));
                      }, 100);
                    }
                  }}
                  className="col-span-2 px-3 py-2 bg-purple-100 rounded-xl border border-purple-200 text-[11px] font-bold text-purple-700 hover:bg-purple-200 transition-all"
                >
                  gorimo2418@disiok.com
                </button>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </form>
  );
}
