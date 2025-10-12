import { useFileUpload } from "@/hooks/use-file-upload";
import { ImagePlusIcon, XIcon } from "lucide-react";

const initialBannerImage = [
  {
    name: "Background Image Museum Geologi",
    size: 716.8,
    type: "image/jpeg",
    url: "/img/bg-education.jpg",
    id: "bg-123456789",
  },
];

export default function ProfileBanner() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      initialFiles: initialBannerImage,
    });

  const currentImage = files[0]?.preview || null;

  return (
    <div className="h-48">
      <div className="bg-black/10 border-b-3 border-black/10 relative size-full flex items-center justify-center overflow-hidden">
        {currentImage && (
          <img
            className="size-full object-cover"
            src={currentImage}
            alt={
              files[0]?.preview
                ? "Preview of uploaded image"
                : "Default profile background"
            }
            width={512}
            height={96}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-3">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-[color,box-shadow] outline-none hover:bg-black/70 focus-visible:ring-[3px]"
            onClick={openFileDialog}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>

          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-[color,box-shadow] outline-none hover:bg-black/70 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload image file"
      />
    </div>
  );
}
