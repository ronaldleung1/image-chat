import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface MessageFormProps {
  onSubmit: (inputValue: string, imageFile: File | null) => void;
  isLoading: boolean;
}

export const MessageForm: React.FC<MessageFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(inputValue, imagePreview);
    setInputValue("");
    setImagePreviewUrl(null);
    setImagePreview(null);
  };

  return (
    <div className="border-t dark:border-zinc-700 p-4">
      <form
        className="flex items-center gap-2 max-w-[700px] mx-auto"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="file-input"
          className="p-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-100"
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
  );
};
