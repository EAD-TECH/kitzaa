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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ReusableFormInput
          control={form.control}
          name="name"
          label="Name"
          type="name"
          placeholder="Category olustur.."
        />
        <ReusableFormInput
          control={form.control}
          name="description"
          label="Description"
          type="description"
          placeholder="Kısa bir açıklama gir"
        />
        <ReusableFormInput
          control={form.control}
          name="icon"
          label="Lucide Icon Adı"
          placeholder="Örn: Leaf, Music, Palette"
        />
        <DynamicIcon name={form.watch("icon") || "HelpCircle"} />


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
