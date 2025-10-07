import { useEffect } from "react";
import { useController } from "react-hook-form";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";

interface ImageUploadFieldProps {
  control: any;
  name: string;
  label?: string;
  shape?: "circle" | "rectangle"; // circle untuk avatar, rectangle untuk background
  initialImage?: string | null;
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
      initialFiles: initialImage ? [{ preview: initialImage }] : [],
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
      className={`relative flex items-center justify-center ${
        shape === "circle"
          ? "size-24 rounded-full border-2 border-black/10 bg-muted shadow-xs overflow-hidden"
          : "h-42 w-full border-b-2 border-black/10 bg-black/10 overflow-hidden"
      } ${className}`}
    >
      {currentImage && (
        <img
          src={currentImage}
          alt={label || "Uploaded image"}
          className={`${
            shape === "circle"
              ? "object-cover size-full"
              : "object-cover size-full"
          }`}
        />
      )}

      {/* Tombol aksi */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-3 ${
          shape === "circle" ? "" : "bg-black/30"
        }`}
      >
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white"
          onClick={openFileDialog}
          aria-label={currentImage ? "Ubah gambar" : "Unggah gambar"}
        >
          <ImagePlusIcon size={16} />
        </button>

        {currentImage && (
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white"
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
