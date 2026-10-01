import {
  UpdateUserFormValues,
  updateUserSchema,
} from "@/features/validations/ReviewApplicationForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetUserById } from "../hooks/useGetUserById";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { ResponsiveModal } from "@/components/shared/modal/ResponsiveModal";
import { useEffect } from "react";
import SectionShell from "@/components/shared/drawer/SectionShell";
import { ReusableFormInput } from "@/components/shared/form/ReusableFormInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReusableFormSelect } from "@/components/shared/form/ReusableFormSelect";
import { UpdateUserDTO } from "../types/users.types";

type UpdateUserFormInput = z.input<typeof updateUserSchema>;

export default function UserActionDrawer() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const userId = params.get("userId");
  const isOpen = Boolean(userId);

  const { data: response, isLoading } = useGetUserById(userId);
  const userData = response?.user;
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const form = useForm<UpdateUserFormInput, unknown, UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "user",
      language: "de",
      location: {
        state: "",
        city: "",
        zipCode: "",
        country: "",
        district: "",
      },
    },
  });

  const {
    formState: { dirtyFields },
  } = form;

  useEffect(() => {
    if (userData) {
      form.reset({
        username: userData.username || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role: userData.role || "user",
        language: userData.language || "de",
        location: {
          state: userData.location?.state || "",
          city: userData.location?.city || "",
          zipCode: userData.location?.zipCode || "",
          country: userData.location?.country || "",
          district: userData.location?.district || "",
        },
      });
    }
  }, [userData, form]);

  function onSubmit(data: UpdateUserFormValues) {
    if (!userId) return;

    const payload: UpdateUserDTO = { _id: userId };
    const changedKey = Object.keys(dirtyFields);
    console.log(changedKey, "degısen kısımlar");

    if (changedKey.length === 0) {
      console.log("Değişiklik yapılmadı, ");
      handleDrawerClose(false);
      return;
    }

    changedKey.forEach((item) => {
      const key = item as keyof UpdateUserFormValues;
      (payload as any)[key] = (data as any)[key];
      console.log(payload, "hangı lokasyon bılgısı");
    });

    if (payload.location && typeof payload.location === "object") {
      Object.keys(payload.location).forEach((locKey) => {
        /* eger lokasyonun bos null undeıfned varsa sıl dızıden */
        if (
          (payload.location as any)[locKey] === "" ||
          (payload.location as any)[locKey] === null ||
          (payload.location as any)[locKey] === undefined
        ) {
          delete (payload.location as any)[locKey];
        }
      });
    }

    updateUser(payload, {
      onSuccess: () => handleDrawerClose(false),
    });
  }

  function handleDrawerClose(open: boolean) {
    if (!open) {
      const currentParams = new URLSearchParams(params.toString());
      currentParams.delete("userId");
      const query = currentParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
      form.reset();
      console.log("form hataları", form.setError);
    }
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleDrawerClose}
      title="Kullanıcı Detayı"
      tag={userData?.role ? userData.role.toUpperCase() : "Yükleniyor..."}
      description={userId ? `Kullanıcı ID: ${userId}` : "Operasyon"}
    >
      <Form {...form}>
        <form
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 tablet:px-6 tablet:py-6 bg-kanban-column-bg">
            {isLoading ? (
              <div className="p-10 text-center">(Yükleniyor)...</div>
            ) : (
              <div className="grid grid-cols-1 tablet:grid-cols-2 min-w-0 gap-2">
                <SectionShell title="Kişisel Bilgiler">
                  <ReusableFormInput
                    control={form.control}
                    name="firstName"
                    label="Ad"
                    placeholder="Adı"
                  />
                  <ReusableFormInput
                    control={form.control}
                    name="lastName"
                    label="Soyad"
                    placeholder="Soyadı"
                  />
                  <ReusableFormInput
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="ornek@mail.com"
                    type="email"
                  />
                  <ReusableFormInput
                    control={form.control}
                    name="phone"
                    label="Telefon"
                    placeholder="+49..."
                  />
                </SectionShell>

                <SectionShell title="Lokasyon Bilgileri">
                  <ReusableFormInput
                    control={form.control}
                    name="location.state"
                    label="State"
                    placeholder="State.."
                  />
                  <ReusableFormInput
                    control={form.control}
                    name="location.city"
                    label="city"
                    placeholder="city..."
                  />
                  <ReusableFormInput
                    control={form.control}
                    name="location.country"
                    label="Country"
                    placeholder="country..."
                  />
                  <ReusableFormInput
                    control={form.control}
                    name="location.zipCode"
                    label="zipCode"
                    placeholder="zipCode"
                  />
                  <ReusableFormInput
                    control={form.control}
                    name="location.district"
                    label="District"
                    placeholder="district..."
                  />
                </SectionShell>
                <SectionShell title="Kullanıcı Rolü ve Dil Tercihi">
                  <ReusableFormSelect
                    control={form.control}
                    name="role"
                    label="Kullanıcı Rolu"
                    placeholder="Bir rol sec.."
                    options={[
                      { label: "Yönetici (Admin)", value: "admin" },
                      { label: "Organizatör", value: "organizer" },
                      { label: "Kullanıcı (User)", value: "user" },
                    ]}
                  />
                  <ReusableFormSelect
                    control={form.control}
                    name="language"
                    label="Kullanıcı Dil Secenegi"
                    placeholder="Bir dil sec.."
                    options={[
                      { label: "DE", value: "de" },
                      { label: "EN", value: "en" },
                    ]}
                  />
                  {/*    <ReusableFormInput
                    control={form.control}
                    name="language"
                    label="language"
                    placeholder="language"
                  /> */}
                </SectionShell>
              </div>
            )}
          </div>

          <div className="shrink-0 flex justify-end gap-2 border-t px-4 py-4 tablet:px-6">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
}
