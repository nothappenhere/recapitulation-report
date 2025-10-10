import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  defaultUserUpdateFormValues,
  UserUpdateSchema,
  type TUserUpdate,
} from "@rzkyakbr/schemas";
import { api, setTitle } from "@rzkyakbr/libs";
import { useNavigate, useParams } from "react-router";
import { ImagePlusIcon, Loader2, XIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { SimpleField } from "@/components/form/SimpleField";
import TicketPriceFormSkeleton from "@/components/skeleton/TicketPriceFormSkeleton";
import { useUser } from "@/hooks/use-user-context";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { ImageUploadField } from "@/components/form/ImageUploadField";

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

export default function UserProfilePage() {
  setTitle("User Profile - GeoTicketing");

  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [didUpdateUsername, setDidUpdateUsername] = useState(false);
  const [biography, setBiography] = useState("");

  const { user, setUser } = useUser();
  const currentUsername = user?.username || null;
  useEffect(() => {
    if (!didUpdateUsername && currentUsername !== username) {
      toast.error("Anda tidak memiliki akses untuk mengunjungi halaman ini.");
      navigate("/dashboard", { replace: true });
    }
  }, [currentUsername, username, navigate, didUpdateUsername]);

  const form = useForm<TUserUpdate>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: defaultUserUpdateFormValues,
  });

  const maxLength = 180;
  const {
    characterCount,
    handleChange,
    maxLength: limit,
    setValue: setBiographyValue,
  } = useCharacterLimit({
    maxLength,
    initialValue: biography,
  });

  //* Fetch data if currently editing
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/user-manage/${username}`);
      const userData = res.data.data;
      form.reset(userData);

      if (userData.biography != null) {
        setBiographyValue(userData.biography);
        setBiography(userData.biography);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
      toast.error(message);
      navigate("/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [form, navigate, username, setBiographyValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //* Submit handler: update data
  const onSubmit = async (values: TUserUpdate): Promise<void> => {
    try {
      const res = await api.put(`/user-manage/${username}`, values);
      toast.success(`${res.data.message}.`);
      // form.reset();

      // Ambil data terbaru setelah update
      const updatedUser = res.data?.data || values;

      // Update data global user jika yang sedang login adalah user yang diubah
      if (user && user.username === username) {
        setUser((prev) => ({
          ...prev!,
          ...updatedUser, // gabungkan dengan data baru
        }));
      }

      setDidUpdateUsername(true);
      // Fetch ulang data terbaru tanpa reload halaman
      await fetchData();

      // Jika username berubah, arahkan ke URL baru
      if (values.username !== username) {
        navigate(`/dashboard/profile/${values.username}`, { replace: true });
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menyimpan data, silakan coba lagi.";
      toast.error(message);
    }
  };

  return (
    <>
      {loading ? (
        <TicketPriceFormSkeleton />
      ) : (
        <>
          <div className="flex justify-center items-center">
            <div className="w-full max-w-lg">
              <Card className="shadow-lg rounded-md">
                <CardHeader className="text-center">
                  <CardTitle>Edit Data Pengguna</CardTitle>
                  <CardDescription>
                    Ubah detail pengguna dengan username: {username}
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent>
                  <ProfileBg />
                  {/* <ImageUploadField
                    control={form.control}
                    name="profileBanner"
                    shape="rectangle"
                    label="Background"
                    initialImage={initialBgImage}
                  /> */}

                  <Avatar />
                  {/* <ImageUploadField
                    control={form.control}
                    name="avatar"
                    shape="circle"
                    label="Foto Profil"
                    initialImage={initialAvatarImage}
                  /> */}

                  <Form {...form}>
                    <pre>{JSON.stringify(form.formState.errors, null, 3)}</pre>

                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="flex flex-col gap-6">
                        {/* Row 1 */}
                        <div className="grid grid-cols-2 gap-3 mt-5">
                          {/* NIP */}
                          <SimpleField
                            control={form.control}
                            type="number"
                            name="NIP"
                            label="Nomor Induk Pegawai"
                            placeholder="Masukan NIP"
                          />

                          {/* Position */}
                          <SimpleField
                            control={form.control}
                            name="position"
                            label="Jabatan"
                            placeholder="Masukan jabatan"
                          />
                        </div>

                        {/* Row 2 */}
                        <div className="grid gap-3">
                          {/* Full Name */}
                          <SimpleField
                            control={form.control}
                            name="fullName"
                            label="Nama Lengkap"
                            placeholder="Masukan nama lengkap"
                          />
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Username */}
                          <SimpleField
                            control={form.control}
                            name="username"
                            label="Username"
                            placeholder="Masukan username"
                          />

                          {/* Role */}
                          <SimpleField
                            control={form.control}
                            name="role"
                            label="Role"
                            placeholder="Masukan role"
                            disabled
                          />
                        </div>

                        {/* Row 4 */}
                        <div className="grid gap-3">
                          {/* Password */}
                          <SimpleField
                            control={form.control}
                            name="newPassword"
                            label="Password Baru"
                            placeholder="Masukan password baru"
                          />
                        </div>

                        {/* ROW 5 */}
                        <div className="grid gap-1.5">
                          {/* Biography */}
                          <SimpleField
                            control={form.control}
                            name="biography"
                            label="Biografi"
                            placeholder="Tuliskan beberapa kalimat tentang diri Anda"
                            component={
                              <Textarea
                                className="rounded-xs"
                                maxLength={maxLength}
                                {...form.register("biography", {
                                  onChange: (e) => {
                                    handleChange(e); // hitung karakter
                                  },
                                })}
                              />
                            }
                          />

                          <p
                            className="text-muted-foreground text-right text-xs"
                            role="status"
                            aria-live="polite"
                          >
                            <span className="tabular-nums">
                              {limit - characterCount}
                            </span>{" "}
                            karakter tersisa
                          </p>
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          className="rounded-xs"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? (
                            <>
                              <Loader2 className="animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Perbarui"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
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
      <div className="bg-black/10 border-b-2 border-black/10 relative size-full flex items-center justify-center overflow-hidden">
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
