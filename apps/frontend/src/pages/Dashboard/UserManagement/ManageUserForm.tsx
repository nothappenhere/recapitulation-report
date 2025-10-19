import { useCallback, useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  defaultRegisterFormValues,
  defaultUserUpdateFormValues,
  RegisterSchema,
  UserUpdateSchema,
  type TRegister,
  type TUserUpdate,
} from "@rzkyakbr/schemas";
import { api } from "@rzkyakbr/libs";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  EyeIcon,
  EyeOffIcon,
  Loader2,
  ShieldUser,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { SimpleField } from "@/components/form/SimpleField";
import FormSkeleton from "@/components/skeleton/FormSkeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import AlertDelete from "@/components/AlertDelete";
import { SelectField } from "@/components/form/SelectField";
import { Input } from "@/components/ui/input";
import ProfileBanner from "@/components/ProfileBanner";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useUser } from "@/hooks/use-user-context";

export default function ManageUserForm() {
  const { username } = useParams();
  const isEditMode = Boolean(username);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [biography, setBiography] = useState("");

  const { user } = useUser();
  const role = user?.role || null;
  if (role !== "Administrator") {
    toast.error("Anda tidak memiliki akses untuk mengunjungi halaman ini.");
    navigate("/dashboard", { replace: true });
  }

  type FormValues = TUserUpdate | TRegister;
  const form = useForm<FormValues>({
    resolver: zodResolver(
      isEditMode ? UserUpdateSchema : RegisterSchema
    ) as Resolver<FormValues>,
    defaultValues: isEditMode
      ? defaultUserUpdateFormValues
      : defaultRegisterFormValues,
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
  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      setLoading(true);

      try {
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

        navigate("/dashboard/user-management", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form, navigate, username, isEditMode, setBiographyValue]);

  //* Submit handler: create or update data
  const onSubmit = async (values: FormValues): Promise<void> => {
    try {
      let res = null;
      if (!isEditMode) {
        // Create data
        res = await api.post(`/auth/register`, values);
      } else {
        // Update data
        res = await api.put(`/user-manage/${username}`, values);
      }

      toast.success(`${res.data.message}.`);
      form.reset();
      navigate(`/dashboard/user-management`, {
        replace: true,
      });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menyimpan data, silakan coba lagi.";
      toast.error(message);
    }
  };

  //* Delete handler: delete data after confirmation
  const confirmDelete = useCallback(async () => {
    if (!username || !isEditMode) return;

    try {
      const res = await api.delete(`/user-manage/${username}`);
      toast.success(`${res.data.message}.`);
      navigate("/dashboard/user-management");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menghapus data, silakan coba lagi.";
      toast.error(message);
    } finally {
      setDeleteOpen(false);
    }
  }, [navigate, username, isEditMode]);

  return (
    <>
      {loading ? (
        <FormSkeleton />
      ) : (
        <>
          <AlertDelete
            open={isDeleteOpen}
            setOpen={setDeleteOpen}
            onDelete={confirmDelete}
          />

          <div className="flex justify-center items-center">
            <div className="w-full max-w-xl">
              <Card className="shadow-lg rounded-md">
                <CardHeader className="text-center">
                  <CardTitle>
                    {isEditMode ? "Edit Data Pengguna" : "Pendataan Pengguna"}
                  </CardTitle>
                  <CardDescription>
                    {isEditMode
                      ? `Ubah detail pengguna dengan username: ${username}`
                      : "Isi formulir di bawah untuk mencatat pengguna baru."}
                  </CardDescription>

                  <CardAction className="flex gap-2">
                    {/* Back */}
                    <Button asChild>
                      <Link to="/dashboard/user-management">
                        <ArrowLeft />
                        Kembali
                      </Link>
                    </Button>

                    {isEditMode && (
                      <>
                        {/* Delete */}
                        <Button
                          variant="destructive"
                          onClick={() => setDeleteOpen(true)}
                        >
                          <Trash2 />
                          Hapus
                        </Button>
                      </>
                    )}
                  </CardAction>
                </CardHeader>
                <Separator />
                <CardContent>
                  <ProfileBanner />
                  <ProfileAvatar />

                  <Form {...form}>
                    {/* <pre>{JSON.stringify(form.formState.errors, null, 3)}</pre> */}

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
                            disabled={isEditMode}
                          />

                          {/* Role */}
                          <SelectField
                            control={form.control}
                            name="role"
                            label="Role"
                            placeholder="Pilih role"
                            icon={ShieldUser}
                            options={[
                              {
                                value: "Administrator",
                                label: "Administrator",
                              },
                              { value: "User", label: "User" },
                            ]}
                          />
                        </div>

                        {/* Row 4 */}
                        <div className="grid gap-3">
                          {/* Password */}
                          <FormField
                            control={form.control}
                            name={isEditMode ? "newPassword" : "password"}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {isEditMode ? "Password Baru" : "Password"}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder={
                                        isEditMode
                                          ? "Masukan password baru"
                                          : "Masukan password"
                                      }
                                      className="rounded-xs"
                                      {...field}
                                    />
                                    <Button
                                      type="button"
                                      variant="link"
                                      size="icon"
                                      className="absolute right-2 top-1/2 -translate-y-1/2"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                    >
                                      {showPassword ? (
                                        <EyeOffIcon className="size-5" />
                                      ) : (
                                        <EyeIcon className="size-5" />
                                      )}
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* ROW 5 */}
                        {isEditMode && (
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
                                  disabled={isEditMode}
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
                        )}

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
                            <>
                              {isEditMode
                                ? "Perbarui Pengguna"
                                : "Tambah Pengguna"}
                            </>
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
