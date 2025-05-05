import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { cn } from "@/lib/utils";
import { GalleryVerticalEnd } from "lucide-react"

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>登录 - AI News</title>
        <meta name="description" content="欢迎登录 AI News 管理系统" />
      </Head>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            AI News
          </a>
          <LoginForm />
        </div>
      </div>
    </>
  );
} 