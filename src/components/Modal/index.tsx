"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Icons } from "@/components/icons";
import { useTheme } from "next-themes";

interface Props {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export function Modal({ isLogin, setIsLogin }: Props) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { resolvedTheme: theme } = useTheme();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailSignIn = () => {
    if (validateEmail(email)) {
      setIsLoading("email");
      signIn("resend", { email, redirectTo: "/" }).finally(() => setIsLoading(null));
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleSocialSignIn = (provider: string) => {
    setIsLoading(provider);
    signIn(provider, { redirectTo: "/" }).finally(() => setIsLoading(null));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleEmailSignIn();
    }
  };

  return (
    <Card className="mx-auto max-w-sm" onKeyDown={handleKeyPress}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{isLogin ? "Welcome back" : "Sign up"}</CardTitle>
        <CardDescription>Enter your email below to {isLogin ? "log in to your account." : "sign up!"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              required
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading !== null}
            />
            {emailError && <p className="text-red-600">{emailError}</p>}
          </div>
          <Button type="submit" className="w-full" onClick={handleEmailSignIn} disabled={isLoading !== null}>
            {isLoading === "email" ? (
              <div className="flex items-center justify-center">
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              `${isLogin ? "Log in" : "Sign up"} with Email`
            )}
          </Button>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-gray-500">or</span>
            </div>
          </div>
          <div className="flex flex-col w-full justify-center items-center gap-4">
            <Button
              variant="secondary"
              className="w-80 h-15"
              onClick={() => handleSocialSignIn("google")}
              disabled={isLoading !== null}
            >
              {isLoading === "google" ? (
                <div className="flex items-center justify-center">
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              ) : (
                <div className="flex justify-center items-center w-40 gap-2">
                  <div className="flex justify-end w-20 mr-1">
                    {theme === "light" ? <Icons.google /> : <Icons.google_dark />}
                  </div>
                  <div className="flex justify-start w-20 mr-10">{isLogin ? "Log in" : "Sign up"} with Google</div>
                </div>
              )}
            </Button>
            <Button
              variant="secondary"
              className="w-80 h-15"
              onClick={() => handleSocialSignIn("facebook")}
              disabled={isLoading !== null}
            >
              {isLoading === "facebook" ? (
                <div className="flex items-center justify-center">
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              ) : (
                <div className="flex justify-center items-center w-40 gap-2">
                  <div className="flex justify-end w-20 mr-1">
                    {theme === "light" ? <Icons.facebook /> : <Icons.facebook_dark />}
                  </div>
                  <div className="flex justify-start w-20 mr-10">
                    {isLogin ? "Log in with Facebook" : "Sign up with Facebook"}
                  </div>
                </div>
              )}
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
