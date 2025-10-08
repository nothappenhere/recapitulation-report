import { useEffect, useId, useState } from "react";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UserFullTypes } from "@rzkyakbr/types";
import { UserUpdateSchema, type TUserUpdate } from "@rzkyakbr/schemas";
import toast from "react-hot-toast";

const initialBgImage = [
  {
    name: "Background Image Museum Geologi",
    size: 716.8,
    type: "image/jpeg",
    url: "/img/bg-education.jpg",
    id: "bg-123456789",
  },
];

const initialAvatarImage = [
  {
    name: "Logo Museum Geologi",
    size: 28.672,
    type: "image/png",
    url: "/img/logo-mg.png",
    id: "avatar-123456789",
  },
];

type DialogEditProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onEdit: (data: TUserUpdate) => void;
  data?: UserFullTypes | null;
};

export default function DetailUser({
  open,
  setOpen,
  onEdit,
  data,
}: DialogEditProps) {
  const id = useId();

  const [nip, setNip] = useState(data?.NIP || "");
  const [position, setPosition] = useState(data?.position || "");
  const [fullName, setFullName] = useState(data?.fullName || "");
  const [username, setUsername] = useState(data?.username || "");
  const [role, setRole] = useState(data?.role || "user");

  useEffect(() => {
    if (!data) return;
    setNip(data.NIP.toString());
    setPosition(data.position);
    setFullName(data.fullName);
    setUsername(data.username);
    setRole(data.role);
  }, [data]);

  const maxLength = 180;
  const {
    value: biographyValue,
    characterCount,
    handleChange,
    maxLength: limit,
    setValue: setBiographyValue,
  } = useCharacterLimit({
    maxLength,
    initialValue: data?.biography || "-",
  });

  useEffect(() => {
    if (data?.biography) {
      setBiographyValue(data.biography);
    }
  }, [data, setBiographyValue]);

  const handleSubmit = () => {
    const result = UserUpdateSchema.safeParse({
      NIP: nip,
      position,
      fullName,
      username,
      biography: biographyValue,
      role,
    });

    if (!result.success) {
      toast.error("Data tidak valid, silakan coba lagi.");
      return;
    }

    onEdit(result.data); // kirim data valid ke parent
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-lg max-h-[90vh] overflow-hidden w-full [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Edit Data Pengguna
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Ubah detail pengguna dengan username: {username}
        </DialogDescription>

        <div className="overflow-y-auto">
          <ProfileBg />
          <Avatar />

          <div className="px-6 pt-4 pb-6">
            <form className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* NIP */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`${id}-nip`}>Nomor Induk Pegawai</Label>
                  <Input
                    id={`${id}-nip`}
                    className="rounded-xs"
                    placeholder="Masukan NIP"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    type="number"
                    required
                  />
                </div>

                {/* Position */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`${id}-position`}>Jabatan</Label>
                  <Input
                    id={`${id}-position`}
                    className="rounded-xs"
                    placeholder="Masukan jabatan"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    type="text"
                    required
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-full-name`}>Nama Lengkap</Label>
                <div className="relative">
                  <Input
                    id={`${id}-full-name`}
                    className="rounded-xs"
                    placeholder="Masukan nama lengkap"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Username */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`${id}-username`}>Username</Label>
                  <Input
                    id={`${id}-username`}
                    className="rounded-xs"
                    placeholder="Masukan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    required
                  />
                </div>

                {/* Role */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`${id}-role`}>Role</Label>
                  <Select value={role} onValueChange={(val) => setRole(val)}>
                    <SelectTrigger className="w-full rounded-xs">
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">
                        Administrator
                      </SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-bio`}>Biografi</Label>
                <Textarea
                  id={`${id}-bio`}
                  className="rounded-xs"
                  placeholder="Tuliskan beberapa kalimat tentang diri Anda"
                  value={biographyValue}
                  maxLength={maxLength}
                  onChange={handleChange}
                  aria-describedby={`${id}-description`}
                />

                <p
                  id={`${id}-description`}
                  className="text-muted-foreground mt-2 text-right text-xs"
                  role="status"
                  aria-live="polite"
                >
                  <span className="tabular-nums">{limit - characterCount}</span>{" "}
                  karakter tersisa
                </p>
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleSubmit}>
              Perbarui Data Pengguna
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      initialFiles: initialBgImage,
    });

  const currentImage = files[0]?.preview || null;

  return (
    <div className="h-44">
      <div className="bg-black/10 border-b-2 border-black/10 relative flex size-full items-center justify-center overflow-hidden">
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

function Avatar() {
  const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
    initialFiles: initialAvatarImage,
  });

  const currentImage = files[0]?.preview || null;

  return (
    <div className="-mt-12 px-6">
      <div className="border-black/10 bg-muted relative flex size-24 items-center justify-center overflow-hidden rounded-full border-3 shadow-xs shadow-black/10">
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
