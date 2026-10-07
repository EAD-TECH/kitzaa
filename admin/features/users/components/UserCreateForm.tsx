"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  userFormSchema,
  UserFormValues,
} from "@/features/validations/ReviewApplicationForm";
import { ReusableFormInput } from "@/components/shared/form/ReusableFormInput";

import { useCreateUser } from "../hooks/useCreateUser";
import { UserCreateFormProps } from "../types/users.types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ReusableFormSelect } from "@/components/shared/form/ReusableFormSelect";

export function UserCreateForm({ onSuccess }: UserCreateFormProps) {
  const { mutate: createUser, isPending } = useCreateUser();
  /* motoru zod ile calıstırıyorm */
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      role: "" as UserFormValues["role"],
    },
  });

  function onSubmit(data: UserFormValues) {
    console.log("Backend'e gidecek veri:", data);
    createUser(data, {
      onSuccess: () => {
        toast.success("Einladung wurde erfolgreich gesendet.");
        onSuccess();
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-4 pb-4 tablet:px-6 tablet:pb-6"
      >
     
        {/*   <ReusableFormInput
          control={form.control}
          name="name"
          label="İsim"
          type="name"
          placeholder="İsim gir.."
        /> */}
        <ReusableFormInput
          control={form.control}
          name="email"
          label="E-Mail"
          type="email"
          placeholder="E-Mail-Adresse eingeben..."
        />
        <ReusableFormSelect
          control={form.control}
          name="role"
          label="Benutzerrolle"
          placeholder="Rolle auswählen..."
          options={[
            { label: "Administrator", value: "admin" },
            { label: "Organisator", value: "organizer" },
            { label: "Benutzer", value: "user" },
          ]}
        />

        {/*   <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kullanıcı Rolü</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Bir rol seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Yönetici (Admin)</SelectItem>
                  <SelectItem value="organizer">Organizatör</SelectItem>
                  <SelectItem value="user">Kullanıcı (User)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          className="mt-2 w-full"
          disabled={isPending}
        >
          {isPending && <Loader2 className="animate-spin" />}
          {isPending ? "Einladung wird gesendet..." : "Einladung senden"}
        </Button>
      </form>
    </Form>
  );
}
