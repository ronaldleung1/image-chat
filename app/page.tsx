"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatLog } from "@/components/ChatLog";
import { MessageForm } from "@/components/MessageForm";

type Message = {
  type: "user" | "bot";
  content: string;
  image?: string;
};

export default function Home() {
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>();
  const [submitForm, setSubmitForm] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleImageRequest = async (url: string, formData: FormData) => {
    setIsLoading(true);
    console.log("handleImageRequest", url, formData);
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setChatLog((prevChatLog: Message[]) => [
        ...prevChatLog,
        { type: "bot", content: "", image: data.image_url },
      ]);
      setSelectedImageUrl(data.image_url);
    } else {
      console.error(
        `Error ${
          url === "/api/generate-image" ? "generating" : "editing"
        } image:`,
        response.statusText
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (submitForm && formData) {
      handleImageRequest("/api/edit-image", formData);
      setSubmitForm(false); // Reset the trigger
    }
  }, [submitForm, formData]);

  const handleFormSubmit = (inputValue: string, imageFile: File | null) => {
    const newFormData = new FormData();
    newFormData.append("prompt", inputValue);

    if (imageFile) {
      newFormData.append("image", imageFile);
      setFormData(newFormData);
      setSubmitForm(true);
    } else {
      handleImageRequest("/api/generate-image", newFormData);
    }

    setChatLog((prevChatLog: Message[]) => [
      ...prevChatLog,
      {
        type: "user",
        content: inputValue,
        image: imageFile ? URL.createObjectURL(imageFile) : undefined,
      },
    ]);
  };

  return (
    <div className="flex h-screen">
      <Sidebar selectedImageUrl={selectedImageUrl} />
      <main className="flex flex-col w-full">
        <ChatLog chatLog={chatLog} isLoading={isLoading} />
        <MessageForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      </main>
    </div>
  );
}
