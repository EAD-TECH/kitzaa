"use client"

import { LoginForm } from "@/features/auth/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 lg:order-last">
        <div className="flex justify-center">
          <a href="/" className="inline-flex items-center">
            <img
              src="/images/logo.png"
              alt="Kitzaa"
              className="h-50 w-auto object-contain"
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center ">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block lg:order-first">
        <img
          src="/images/login-img.png"
          alt="Familie lacht gemeinsam in einem sonnigen Gemeinschaftsgarten"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
