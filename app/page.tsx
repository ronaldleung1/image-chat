"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

type Message = {
  type: "user" | "bot";
  content: string;
};

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChatLog((prevChatLog: Message[]) => [
      ...prevChatLog,
      { type: "user", content: inputValue },
    ]);
    setInputValue("");
  };
  return (
    <>
      <h1>Image Chat</h1>
      {chatLog.map((message, index) => (
        <div key="index">
          {message.type === "user" ? "You: " : "ChatGPT: "}
          {message.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Describe your image..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
