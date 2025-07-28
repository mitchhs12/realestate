import ChatClient from "@/components/ChatClient";
import { setStaticParamsLocale } from "next-international/server";

export default async function ChatPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  // Ensure locale context is set on server
  setStaticParamsLocale(params.locale);

  return (
    <div className="container mx-auto max-w-2xl py-6">
      <h1 className="text-2xl font-bold mb-4">AI Property Chat</h1>
      <ChatClient />
    </div>
  );
}
