import { useFileUpload } from "@/hooks/use-file-upload";
import { ImagePlusIcon } from "lucide-react";

const initialAvatarImage = [
  {
    name: "Logo Museum Geologi",
    size: 28.672,
    type: "image/png",
    url: "/img/logo-mg.png",
    id: "avatar-123456789",
  },
];

export default function ProfileAvatar() {
  const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
    initialFiles: initialAvatarImage,
  });

  const currentImage = files[0]?.preview || null;

  return (
    <div className="-mt-12 px-6">
      <div className="border-black/10 bg-muted relative size-24 flex items-center justify-center overflow-hidden rounded-full border-3 shadow-xs shadow-black/10">
        {currentImage && (
          <img
            src={currentImage}
            className="size-full object-cover"
            width={80}
            height={80}
            alt={
              files[0]?.preview
                ? "Preview of uploaded profile image"
                : "Default profile image"
            }
          />
        )}

        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-[color,box-shadow] outline-none hover:bg-black/70 focus-visible:ring-[3px]"
          onClick={openFileDialog}
          aria-label="Change profile picture"
        >
          <ImagePlusIcon size={16} aria-hidden="true" />
        </button>

        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload profile picture"
        />
      </div>
    </div>
  );
}
