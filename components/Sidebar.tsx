import Image from "next/image";

interface SidebarProps {
  selectedImageUrl?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedImageUrl }) => {
  return (
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
  );
};
