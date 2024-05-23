"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { Image as ImageIcon, Download, X } from "lucide-react";

type Message = {
  type: "user" | "bot";
  content: string;
};

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  const [submitForm, setSubmitForm] = useState(false);

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
        { type: "bot", content: data.image_url },
      ]);
      setSelectedImageUrl(data.image_url);
      // TODO: set selected image

      // if generation is iterative, set the selected image to the latest image
      // setIsEditing(true);
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
    if (submitForm && selectedImage) {
      const formData = new FormData();
      formData.append("prompt", inputValue);
      formData.append("image", selectedImage);
      handleImageRequest("/api/edit-image", formData);
      setSubmitForm(false); // Reset the trigger
    }
  }, [submitForm, selectedImage, inputValue]);

  // Modify your handleSubmit function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if there is an image uploaded according to the form, set it as the selected image
    if (imagePreview) {
      setSelectedImage(imagePreview);
      setImagePreviewUrl(null);
      setImagePreview(null);
      setSubmitForm(true); // Set the trigger for the API call
    } else {
      const formData = new FormData();
      formData.append("prompt", inputValue);
      handleImageRequest("/api/generate-image", formData);
    }

    setChatLog((prevChatLog: Message[]) => [
      ...prevChatLog,
      { type: "user", content: inputValue },
    ]);

    // Defer the execution of setInputValue("")
    setTimeout(() => {
      setInputValue("");
    }, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(file); // Store the file object
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreviewUrl(null);
    setImagePreview(null);
  };

  return (
    <div className="flex h-screen">
      <aside className="w-80 h-full border-r border-stone-200 dark:border-stone-700 overflow-y-auto">
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">Image Chat</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-700">
              {selectedImageUrl ? (
                <Image
                  alt="User Avatar"
                  className="rounded-full bg-muted"
                  height="40"
                  src={selectedImageUrl}
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
                <h3 className="font-semibold">New Chat</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Just now
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
              </div>
            )}
          </div>
        </div>
        <div className="border-t dark:border-zinc-700 p-4">
          <form
            className="flex items-center gap-2 max-w-[700px] mx-auto"
            onSubmit={handleSubmit}
          >
            <label
              htmlFor="file-input"
              className={buttonVariants({ variant: "ghost" })}
            >
              <ImageIcon className="w-6 h-6" />
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {imagePreviewUrl && (
              <div className="relative">
                <Image
                  src={imagePreviewUrl}
                  alt="Preview"
                  width="96"
                  height="96"
                  style={{
                    aspectRatio: "40/40",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-[-4px] top-[-4px] bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center hover:bg-red-400"
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            )}
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                imagePreview ? "Describe changes..." : "Describe your image..."
              }
            />
            <Button type="submit" disabled={isLoading || !inputValue}>
              {imagePreview ? "Edit Image" : "Generate Image"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
