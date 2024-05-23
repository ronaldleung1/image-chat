"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { Image as ImageIcon, Download } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

type Message = {
  type: "user" | "bot";
  content: string;
};

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [latestImage, setLatestImage] = useState<string>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChatLog((prevChatLog: Message[]) => [
      ...prevChatLog,
      { type: "user", content: inputValue },
    ]);

    generateImage(inputValue);

    setInputValue("");
  };
  const generateImage = async (prompt: string) => {
    // setChatLog((prevChatLog: Message[]) => [
    //   ...prevChatLog,
    //   {
    //     type: "bot",
    //     content:
    //       "https://oaidalleapiprodscus.blob.core.windows.net/private/org-S4KZYdYIayqtzUwHfdkD7lIX/user-CkSj5QcD2vSaAnIbQJyHDe00/img-tRzDBF6rrL2ceC87JwyRzGNT.png?st=2024-05-22T20%3A32%3A26Z&se=2024-05-22T22%3A32%3A26Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-05-22T10%3A37%3A46Z&ske=2024-05-23T10%3A37%3A46Z&sks=b&skv=2021-08-06&sig=MFDmc01DkF0%2Brzy1d7inblRkaB986DHDdWSJQWv590E%3D",
    //   },
    // ]);
    setIsLoading(true);
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });
    if (response.ok) {
      const data = await response.json();
      setChatLog((prevChatLog: Message[]) => [
        ...prevChatLog,
        { type: "bot", content: data.image_url },
      ]);
      setIsLoading(false);
      setIsEditing(true);
    } else {
      console.error("Error generating image:", response.statusText);
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-80 h-full border-r border-stone-200 dark:border-stone-700 overflow-y-auto">
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">Image Chat</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-700">
              {latestImage ? (
                <Image
                  alt="User Avatar"
                  className="rounded-full bg-muted"
                  height="40"
                  src={latestImage}
                  style={{
                    aspectRatio: "40/40",
                    objectFit: "cover",
                  }}
                  width="40"
                />
              ) : (
                <div className="rounded-full h-[40px] w-[40px] border bg-background border-stone-200"></div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold">
                  Cat taking a selfie while sleeping on a yacht
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  2d ago
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700">
              <img
                alt="User Avatar"
                className="rounded-full"
                height="40"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "40/40",
                  objectFit: "cover",
                }}
                width="40"
              />
              <div className="flex-1">
                <h3 className="font-semibold">Jane Smith</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Just checking in...
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex flex-col w-full">
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-[700px] space-y-4 mx-auto pt-8">
            {chatLog.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "user" ? (
                  <div className="rounded-lg bg-primary text-primary-foreground p-3 max-w-[75%]">
                    <p className="text-sm">{message.content}</p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-lg bg-muted p-3 max-w-[75%]">
                      <Image
                        src={message.content}
                        alt="Generated by DALL-E"
                        width="256"
                        height="256"
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => window.open(message.content, "_blank")}
                      >
                        <Download className="w-6 h-6" />
                      </Button>
                      <Badge variant="outline">v{(index - 1) / 2}</Badge>
                    </div>
                  </>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="rounded-lg bg-muted p-3 max-w-[75%]">
                  <Skeleton className="h-[256px] w-[256px] rounded-lg" />
                </div>
                <Badge variant="outline">v{(chatLog.length - 1) / 2}</Badge>
              </div>
            )}
          </div>
        </div>
        <div className="border-t dark:border-zinc-700 p-4">
          <form
            className="flex items-center gap-2 max-w-[700px] mx-auto"
            onSubmit={handleSubmit}
          >
            <Button size="icon" variant="ghost">
              <ImageIcon className="w-6 h-6" />
            </Button>
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isEditing ? "Describe changes..." : "Describe your image..."
              }
            />
            <Button type="submit" disabled={isLoading || !inputValue}>
              {isEditing ? "Edit Image" : "Generate Image"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
