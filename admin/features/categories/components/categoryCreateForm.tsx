"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReusableFormInput } from "@/components/shared/form/ReusableFormInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ReusableFormSelect } from "@/components/shared/form/ReusableFormSelect";
import { CategoryCreateFormProps } from "../types/categories";
import { useCreateCategory } from "../hooks/useCreateCategory";
import {
  categoryFormSchema,
  CategoryFormValues,
} from "@/features/validations/CategoryForm";
import DynamicIcon from "@/components/shared/table/DynamicIcon";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function CategoryCreateForm({ onSuccess }: CategoryCreateFormProps) {
  const { mutate: createCategory, isPending } = useCreateCategory();
  /* motoru zod ile calıstırıyorm */
  const form = useForm<
    z.input<typeof categoryFormSchema>,
    unknown,
    z.output<typeof categoryFormSchema>
  >({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      isActive: true,
    },
  });

  function onSubmit(data: CategoryFormValues) {
    console.log("Backend'e gidecek veri:", data);
    createCategory(data, {
      onSuccess: () => {
        toast.success("Category basarıyla olusturuldu.");
        onSuccess();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
        <ReusableFormInput
          control={form.control}
          name="name"
          label="Name"
          type="name"
          placeholder="Category olustur.."
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Kısa bir açıklama gir"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex min-w-0 items-end gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <DynamicIcon name={form.watch("icon") || "HelpCircle"} />
          </div>

          <div className="min-w-0 flex-1">
            <ReusableFormInput
              control={form.control}
              name="icon"
              label="Lucide Icon Adı"
              placeholder="Örn: Leaf, Music, Palette"
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Durum</FormLabel>
                <div className="flex h-9 items-center">
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          className="w-full"
          disabled={isPending}
        >
          {isPending && <Loader2 className="animate-spin" />}
          {isPending ? "Category oluşturuluyor..." : "Category oluştur"}
        </Button>
      </form>
    </Form>
  );
}
