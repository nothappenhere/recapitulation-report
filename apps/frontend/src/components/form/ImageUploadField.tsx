import { useEffect } from "react";
import { useController } from "react-hook-form";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";

type FileMetadata = {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
};
interface ImageUploadFieldProps {
  control: any;
  name: string;
  label?: string;
  shape?: "circle" | "rectangle"; // circle untuk avatar, rectangle untuk background
  initialImage?: FileMetadata[];
  className?: string;
}

export function ImageUploadField({
  control,
  name,
  label,
  shape = "rectangle",
  initialImage = null,
  className = "",
}: ImageUploadFieldProps) {
  const { field } = useController({ name, control });
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      initialFiles: initialImage,
    });

  const currentImage = files[0]?.preview || null;

  // Update field value di react-hook-form saat file berubah
  useEffect(() => {
    field.onChange(files[0] || null);
  }, [field, files]);

  // Pisahkan ref agar ref file input tetap berfungsi
  const { ref, ...inputProps } = getInputProps();

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        shape === "circle"
          ? "border-black/10 bg-muted relative -mt-12 mx-6 size-24 rounded-full border-3 shadow-xs"
          : "bg-black/10 border-b-2 border-black/10 relative size-full h-44"
      } ${className}`}
    >
      {currentImage && (
        <img
          src={currentImage}
          className="object-cover size-full"
          width={shape === "circle" ? 80 : 512}
          height={shape === "circle" ? 80 : 96}
          alt={label || "Uploaded image"}
        />
      )}

      {/* Tombol aksi */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/10 ${
          shape === "circle" ? "" : "bg-black/10"
        }`}
      >
        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-[color,box-shadow] outline-none hover:bg-black/70 focus-visible:ring-[3px]"
          onClick={openFileDialog}
          aria-label={currentImage ? "Ubah gambar" : "Unggah gambar"}
        >
          <ImagePlusIcon size={16} />
        </button>

        {currentImage && shape !== "circle" && (
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-[color,box-shadow] outline-none hover:bg-black/70 focus-visible:ring-[3px]"
            onClick={() => removeFile(files[0]?.id)}
            aria-label="Hapus gambar"
          >
            <XIcon size={16} />
          </button>
        )}
      </div>

      {/* Input file */}
      <input
        ref={ref}
        {...inputProps}
        className="sr-only"
        aria-label={label || "Upload file"}
      />
    </div>
  );
}
