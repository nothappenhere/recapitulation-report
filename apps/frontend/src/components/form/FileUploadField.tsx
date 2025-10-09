/* eslint-disable react-hooks/rules-of-hooks */
import {
  Controller,
  useFormContext,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useFileUpload, formatBytes } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileIcon,
  UploadIcon,
  UploadCloudIcon,
  Trash2Icon,
  DownloadIcon,
  AlertCircleIcon,
  ImageIcon,
  VideoIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  FileArchiveIcon,
  HeadphonesIcon,
} from "lucide-react";
import { api } from "@rzkyakbr/libs";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

type FileUploadFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  accept: string;
  maxSize?: number;
  maxFiles?: number;
  initialFiles?: {
    name: string;
    size: number;
    type: string;
    url: string;
    id: string;
  }[];
  isEditMode?: boolean;
};

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  if (
    fileType.includes("pdf") ||
    fileName.endsWith(".pdf") ||
    fileType.includes("word") ||
    fileName.endsWith(".doc")
  ) {
    return <FileTextIcon className="size-4 opacity-60" />;
  } else if (
    fileType.includes("zip") ||
    fileType.includes("archive") ||
    fileName.endsWith(".zip")
  ) {
    return <FileArchiveIcon className="size-4 opacity-60" />;
  } else if (
    fileType.includes("excel") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  ) {
    return <FileSpreadsheetIcon className="size-4 opacity-60" />;
  } else if (fileType.includes("video/")) {
    return <VideoIcon className="size-4 opacity-60" />;
  } else if (fileType.includes("audio/")) {
    return <HeadphonesIcon className="size-4 opacity-60" />;
  } else if (fileType.startsWith("image/")) {
    return <ImageIcon className="size-4 opacity-60" />;
  }
  return <FileIcon className="size-4 opacity-60" />;
};

type TFile = {
  file: {
    name: string;
    type: string;
  };
};

export function FileUploadField<T extends FieldValues>({
  control,
  name,
  label = "Upload files",
  accept,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  initialFiles = [],
  isEditMode,
}: FileUploadFieldProps<T>) {
  const { setValue } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const [uploadProgress, setUploadProgress] = useState<
          { fileId: string; progress: number; completed: boolean }[]
        >([]);

        const [
          { files, isDragging, errors },
          {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            clearFiles,
            getInputProps,
          },
        ] = useFileUpload({
          multiple: true,
          accept,
          maxFiles,
          maxSize,
          initialFiles,
          onFilesChange: (newFiles) => {
            const actualFiles = newFiles.map((f) => f.file);
            setValue(name, actualFiles, { shouldValidate: true });

            // Tambah tracking upload progress
            const newProgressItems = newFiles.map((f) => ({
              fileId: f.id,
              progress: 0,
              completed: false,
            }));

            setUploadProgress((prev) => [...prev, ...newProgressItems]);

            // Jalankan simulasi untuk setiap file baru
            newFiles.forEach((file) => {
              const fileSize = file.file.size || 1000000;

              simulateUpload(
                fileSize,
                (progress) => {
                  setUploadProgress((prev) =>
                    prev.map((item) =>
                      item.fileId === file.id ? { ...item, progress } : item
                    )
                  );
                },
                () => {
                  setUploadProgress((prev) =>
                    prev.map((item) =>
                      item.fileId === file.id
                        ? { ...item, completed: true }
                        : item
                    )
                  );
                }
              );
            });
          },
        });

        // Fungsi download otomatis
        const handleDownload = async (file: TFile["file"]) => {
          try {
            const response = await api.get(
              `/custom-reservation/file/${file.name}`,
              { responseType: "blob" }
            );

            // ambil MIME type dari server
            const contentType = response.headers["content-type"] || file.type;

            // buat blob URL
            const blob = new Blob([response.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);

            if (
              // contentType.startsWith("image/") ||
              contentType === "application/pdf"
            ) {
              // preview di tab baru
              window.open(url, "_blank");
            } else {
              // download otomatis
              const link = document.createElement("a");
              link.href = url;
              link.download = file.name;
              document.body.appendChild(link);
              link.click();
              link.remove();
            }

            // revoke URL setelah beberapa detik (biar sempat dimuat dulu)
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
            }, 5000);
          } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            const message =
              error.response?.data?.message ||
              "Terjadi kesalahan saat memuat file, silakan coba lagi.";
            toast.error(message);
          }
        };

        return (
          <div className="flex flex-col gap-2">
            {files.length === 0 && (
              <>
                {/* Drop area */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  data-dragging={isDragging || undefined}
                  data-files={files.length > 0 || undefined}
                  className="flex min-h-56 flex-col items-center justify-center rounded-xs border border-black border-dashed p-4 transition-colors duration-200 ease-in-out data-[dragging=true]:bg-blue-50 data-[dragging=true]:border-blue-500"
                >
                  <input
                    {...getInputProps()}
                    className="sr-only"
                    aria-label={label}
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="bg-background mb-2 flex size-11 items-center justify-center rounded-full border">
                      <FileIcon className="size-4 opacity-60" />
                    </div>
                    <p className="mb-1.5 text-sm font-medium">{label}</p>
                    <p className="text-muted-foreground text-xs">
                      Maksimal {maxFiles} file ∙ Hingga {formatBytes(maxSize)}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 rounded-sm"
                      onClick={openFileDialog}
                    >
                      <UploadIcon
                        className="-ms-1 opacity-60"
                        aria-hidden="true"
                      />
                      Pilih berkas
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* File list */}
            {files.length > 0 && (
              <>
                {/* Table with files */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium">
                    Berkas Nota Dinas Permohonan Pengajuan Tarif Khusus (
                    {files.length})
                  </h3>
                  <div className="flex gap-2">
                    <input
                      {...getInputProps()}
                      className="sr-only"
                      aria-label={label}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-sm border border-neutral-400"
                      size="sm"
                      onClick={openFileDialog}
                    >
                      <UploadCloudIcon
                        className="-ms-0.5 size-3.5 opacity-60"
                        aria-hidden="true"
                      />
                      Tambah berkas
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-sm border border-neutral-400"
                      size="sm"
                      onClick={clearFiles}
                    >
                      <Trash2Icon
                        className="-ms-0.5 size-3.5 opacity-60"
                        aria-hidden="true"
                      />
                      Hapus semua
                    </Button>
                  </div>
                </div>
                <div className="bg-background overflow-hidden rounded-xs border">
                  <Table>
                    <TableHeader className="text-xs">
                      <TableRow className="bg-muted/50">
                        <TableHead className="h-9 py-2">Name</TableHead>
                        <TableHead className="h-9 py-2">Type</TableHead>
                        <TableHead className="h-9 py-2">Size</TableHead>
                        <TableHead className="h-9 w-0 py-2">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-[13px]">
                      {files.map((file) => (
                        <>
                          <TableRow key={file.id}>
                            <TableCell className="max-w-48 py-2 font-medium">
                              <span className="flex items-center gap-2">
                                <span className="shrink-0">
                                  {getFileIcon(file)}
                                </span>{" "}
                                <span className="truncate">
                                  {file.file.name}
                                </span>
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground py-2">
                              {file.file.type.split("/")[1]?.toUpperCase() ||
                                "UNKNOWN"}
                            </TableCell>
                            <TableCell className="text-muted-foreground py-2">
                              {formatBytes(file.file.size)}
                            </TableCell>
                            <TableCell className="py-2 text-right whitespace-nowrap">
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="text-muted-foreground hover:text-foreground size-8 hover:bg-transparent"
                                aria-label={`Download ${file.file.name}`}
                                onClick={() =>
                                  isEditMode
                                    ? handleDownload(file.file)
                                    : window.open(file.preview, "_blank")
                                }
                              >
                                <DownloadIcon className="size-4" />
                              </Button>

                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="text-muted-foreground hover:text-foreground size-8 hover:bg-transparent"
                                aria-label={`Remove ${file.file.name}`}
                                onClick={() => {
                                  removeFile(file.id);
                                  setUploadProgress((prev) =>
                                    prev.filter((p) => p.fileId !== file.id)
                                  );
                                }}
                              >
                                <Trash2Icon className="size-4" />
                              </Button>
                            </TableCell>
                          </TableRow>

                          {/* Upload progress bar */}
                          {(() => {
                            const progressData = uploadProgress.find(
                              (p) => p.fileId === file.id
                            );
                            if (!progressData || progressData.completed)
                              return null;

                            return (
                              <TableRow>
                                <TableCell colSpan={4} className="py-1">
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                      <div
                                        className="bg-primary h-full transition-all duration-300 ease-out"
                                        style={{
                                          width: `${progressData.progress}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-muted-foreground w-10 text-xs tabular-nums">
                                      {progressData.progress}%
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })()}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

            {errors.length > 0 && (
              <ul className="text-destructive text-xs space-y-1">
                {errors.map((err, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <AlertCircleIcon className="size-3" />
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            )}

            {fieldState.error && (
              <p className="text-destructive text-xs">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}

// Function to simulate file upload with more realistic timing and progress
const simulateUpload = (
  totalBytes: number,
  onProgress: (progress: number) => void,
  onComplete: () => void
) => {
  let timeoutId: NodeJS.Timeout;
  let uploadedBytes = 0;
  let lastProgressReport = 0;

  const simulateChunk = () => {
    // Simulate variable network conditions with random chunk sizes
    const chunkSize = Math.floor(Math.random() * 300000) + 2000;
    uploadedBytes = Math.min(totalBytes, uploadedBytes + chunkSize);

    // Calculate progress percentage (0-100)
    const progressPercent = Math.floor((uploadedBytes / totalBytes) * 100);

    // Only report progress if it's changed by at least 1%
    if (progressPercent > lastProgressReport) {
      lastProgressReport = progressPercent;
      onProgress(progressPercent);
    }

    // Continue simulation if not complete
    if (uploadedBytes < totalBytes) {
      // Variable delay between 50ms and 500ms to simulate network fluctuations (reduced for faster uploads)
      const delay = Math.floor(Math.random() * 450) + 50;

      // Occasionally add a longer pause to simulate network congestion (5% chance, shorter duration)
      const extraDelay = Math.random() < 0.05 ? 500 : 0;

      timeoutId = setTimeout(simulateChunk, delay + extraDelay);
    } else {
      // Upload complete
      onComplete();
    }
  };

  // Start the simulation
  timeoutId = setTimeout(simulateChunk, 100);

  // Return a cleanup function to cancel the simulation
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
};
