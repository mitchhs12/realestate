"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Icons } from "@/components/Icons/icons";
import { useTheme } from "next-themes";
import { useScopedI18n } from "@/locales/client";
import { QueryContext } from "@/context/QueryContext";

export function Modal() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { resolvedTheme: theme } = useTheme();
  const { isLoginOpen, setIsLoginOpen } = useContext(QueryContext);
  const [isLogin, setIsLogin] = useState(isLoginOpen);
  const g = useScopedI18n("home.modal.general");
  const t = useScopedI18n(`home.modal.${isLogin ? "log-in" : "sign-up"}`);

  useEffect(() => {
    if (isLogin !== isLoginOpen) {
      setIsLogin(isLoginOpen);
    }
  }, [isLoginOpen]);

  useEffect(() => {
    // Update the parent `handleLogin` state only if it differs
    if (setIsLoginOpen && isLogin && isLoginOpen !== isLogin) {
      setIsLoginOpen(isLogin);
    }
  }, [isLogin]);

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
      signIn("resend", { email }).finally(() => setIsLoading(null));
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleSocialSignIn = (provider: string) => {
    setIsLoading(provider);
    signIn(provider).finally(() => setIsLoading(null));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleEmailSignIn();
    }
  };

  return (
    <Card className="mx-auto max-w-sm" onKeyDown={handleKeyPress}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{g("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={g("email-placeholder")}
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
                {g("loading")}
              </div>
            ) : (
              g("submit")
            )}
          </Button>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-gray-500">{g("or")}</span>
            </div>
          </div>
          <div className="flex flex-col w-full justify-center items-center gap-4">
            <Button
              variant="secondary"
              className="w-80 h-16"
              onClick={() => handleSocialSignIn("google")}
              disabled={isLoading !== null}
            >
              <div className="flex justify-between items-center w-full gap-5">
                <div className="flex w-[38px] h-[38px] justify-center items-center">
                  {isLoading === "google" ? (
                    <ReloadIcon className="animate-spin h-7 w-7" />
                  ) : theme === "light" ? (
                    <Icons.google />
                  ) : (
                    <Icons.google_dark />
                  )}
                </div>
                <div className="flex flex-grow">{isLoading === "google" ? g("loading") : t("google")}</div>
              </div>
            </Button>
            <Button
              variant="secondary"
              className="w-80 h-16"
              onClick={() => handleSocialSignIn("apple")}
              disabled={isLoading !== null}
            >
              <div className="flex justify-between items-center w-full gap-5">
                <div className="flex w-[38px] h-[38px] justify-center items-center">
                  {isLoading === "apple" ? (
                    <ReloadIcon className="animate-spin h-7 w-7" />
                  ) : theme === "light" ? (
                    <Icons.apple />
                  ) : (
                    <Icons.apple_dark />
                  )}
                </div>
                <div className="flex flex-grow">{isLoading === "apple" ? g("loading") : t("apple")}</div>
              </div>
            </Button>
            <Button
              variant="secondary"
              className="w-80 h-16"
              onClick={() => handleSocialSignIn("facebook")}
              disabled={isLoading !== null}
            >
              <div className="flex justify-between items-center w-full gap-5">
                <div className="flex w-[38px] h-[38px] justify-center items-center">
                  {isLoading === "facebook" ? (
                    <ReloadIcon className="animate-spin h-7 w-7" />
                  ) : theme === "light" ? (
                    <Icons.facebook />
                  ) : (
                    <Icons.facebook_dark />
                  )}
                </div>
                <div className="flex flex-grow">{isLoading === "facebook" ? g("loading") : t("facebook")} </div>
              </div>
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          {t("already")}
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {t("change")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
