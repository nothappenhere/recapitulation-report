import { useEffect, useState } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  defaultUserUpdateFormValues,
  UserUpdateSchema,
  type TUserUpdate,
} from "@rzkyakbr/schemas";
import { api, setTitle } from "@rzkyakbr/libs";
import { useNavigate, useParams } from "react-router";
import { EyeIcon, EyeOffIcon, Loader2, ShieldUser } from "lucide-react";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { SimpleField } from "@/components/form/SimpleField";
import FormSkeleton from "@/components/skeleton/FormSkeleton";
import { useUser } from "@/hooks/use-user-context";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { SelectField } from "@/components/form/SelectField";
import { Input } from "@/components/ui/input";
import ProfileBanner from "@/components/ProfileBanner";
import ProfileAvatar from "@/components/ProfileAvatar";

export default function UserProfilePage() {
  setTitle("User Profile - GeoVisit");

  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [biography, setBiography] = useState("");

  const { setUser } = useUser();

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
  useEffect(() => {
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
        navigate("/dashboard", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form, navigate, username, setBiographyValue]);

  //* Submit handler: update data
  const onSubmit = async (values: TUserUpdate): Promise<void> => {
    try {
      const res = await api.put(`/user-manage/${username}`, values);
      toast.success(`${res.data.message}.`);

      // Update data global user jika yang sedang login adalah user yang diubah
      const updatedUser = res.data?.data || values;
      setUser((prev: any) => ({
        ...prev!,
        ...updatedUser, // gabungkan dengan data baru
      }));
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
        <FormSkeleton />
      ) : (
        <>
          <div className="flex justify-center items-center">
            <div className="w-full max-w-xl">
              <Card className="shadow-lg rounded-md">
                <CardHeader className="text-center">
                  <CardTitle>Edit Data Pengguna</CardTitle>
                  <CardDescription>
                    Ubah detail pengguna dengan username: {username}
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent>
                  <ProfileBanner />
                  <ProfileAvatar />

                  <Form {...form}>
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
                            disabled
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
                            disabled
                          />
                        </div>

                        {/* Row 4 */}
                        <div className="grid gap-3">
                          {/* Password */}
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password Baru</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Masukan password baru"
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
                            "Perbarui Pengguna"
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
