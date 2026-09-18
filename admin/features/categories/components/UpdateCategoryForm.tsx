import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

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
  updateCategoryFormSchema,
  UpdateCategoryFormValues,
} from "@/features/validations/CategoryForm";
import { useGetCategoryById } from "../hooks/useGetCategoryById";
import { UpdateCategoryDTO } from "../types/categories";
import DynamicIcon from "@/components/shared/table/DynamicIcon";
import { Switch } from "@/components/ui/switch";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { Textarea } from "@/components/ui/textarea";

export default function UpdateCategoryForm() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const categoryId = params.get("categoryId");
  const isOpen = Boolean(categoryId);

  const { data: response, isLoading } = useGetCategoryById(categoryId);
  const categoryData = response?.category;
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const form = useForm<
    UpdateCategoryFormValues,
    unknown,
    UpdateCategoryFormValues
  >({
    resolver: zodResolver(updateCategoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      isActive: false,
    },
  });

  const {
    formState: { dirtyFields },
  } = form;

  useEffect(() => {
    if (categoryData) {
      form.reset({
        name: categoryData.name,
        description: categoryData.description ?? "",
        icon: categoryData.icon ?? "",
        isActive: categoryData.isActive,
      });
    }
  }, [categoryData, form]);

  function onSubmit(data: UpdateCategoryFormValues) {
    if (!categoryData || !categoryId) return;

    const payload: UpdateCategoryDTO = { _id: categoryId };
    const changedKey = Object.keys(dirtyFields);
    console.log(changedKey, "degısen kısımlar");

    if (changedKey.length === 0) {
      console.log("Değişiklik yapılmadı, ");
      handleDrawerClose(false);
      return;
    }

    changedKey.forEach((item) => {
      const key = item as keyof UpdateCategoryFormValues;
      (payload as any)[key] = (data as any)[key];
      console.log(payload, "hangı lokasyon bılgısı");
    });

    updateCategory(payload, {
      onSuccess: () => handleDrawerClose(false),
    });
  }

  function handleDrawerClose(open: boolean) {
    if (!open) {
      const currentParams = new URLSearchParams(params.toString());
      currentParams.delete("categoryId");
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
      title="Kategori Detayı"
      description={categoryId ? `Kategori ID: ${categoryId}` : "Operasyon"}
    >
      <Form {...form}>
        <form
          className="flex flex-col min-h-0 overflow-hidden"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col flex-1 gap-4 overflow-y-auto px-4">
            {isLoading ? (
              <div className="p-10 text-center">(Yükleniyor)...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <ReusableFormInput
                  control={form.control}
                  name="name"
                  label="Kategori Adı"
                  placeholder="kategori adı.."
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Detayı</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="kategori detayi.."
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                    <DynamicIcon name={form.watch("icon") || "HelpCircle"} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <ReusableFormInput
                      control={form.control}
                      name="icon"
                      label="Icon"
                      placeholder="Leaf, Trash..."
                    />
                  </div>
                </div>
              </div>
            )}
             <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex  items-center  justify-between">
                <div className="flex flex-col gap-2">
                  <FormLabel>Durum</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    {field.value ? "Kategori aktif" : "Kategori pasif"}
                  </p>
                </div>

                <FormControl>
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          </div>
         

          <div className="flex justify-end gap-2 px-4 py-4">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
}
