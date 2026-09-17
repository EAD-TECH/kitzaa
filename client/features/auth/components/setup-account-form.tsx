"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "next/navigation"

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperTrigger,
} from "@/components/reui/stepper"

import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, Eye, EyeOff, Loader2 } from 'lucide-react'
import logo from "../../../public/images/logo.png"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"


import { 
  createSetupAccountSchema, 
  toSetupAccountPayload, 
  type SetupAccountFormValues 
} from "../validations/setup-account.schema"


import { useSetupAccount } from "../hooks/useSetupAccount"

const steps = [1, 2]


const STEP_1_FIELDS = [
  "firstName",
  "lastName",
  "username",
  "newPassword",
  "confirmPassword",
  "phone",
] as const

export function SetupAccountForm() {
  const t = useTranslations("Register")
  const params = useParams()
  const token = params.token as string

  
  const setupSchema = createSetupAccountSchema(t)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLookingUpZip, setIsLookingUpZip] = useState(false)

  
  const { mutate: submitSetup, isPending, isSuccess, error } = useSetupAccount()

  const form = useForm<SetupAccountFormValues>({
    resolver: zodResolver(setupSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      newPassword: "", 
      confirmPassword: "",
      countryCode: "+49",
      phone: "",
      location: {
        state: "",
        city: "",
        district: "",
        zipCode: "",
      },
      language: "de",
    },
  })

  const zipCode = form.watch("location.zipCode")

  const goToNextStep = async () => {
    const isStepValid = await form.trigger(STEP_1_FIELDS)  
    if (isStepValid) setCurrentStep((prev) => prev + 1)
  }

 
  const onSubmit = async (data: SetupAccountFormValues) => {
    const payload = toSetupAccountPayload(data)
    submitSetup({ token, payload })
  }

  useEffect(() => {
    if (!/^\d{5}$/.test(zipCode)) {
      form.clearErrors("location.zipCode")
      return
    }

    const controller = new AbortController() 
    const timeoutId = setTimeout(async () => {
      setIsLookingUpZip(true)
      form.clearErrors("location.zipCode")
      try {
        const res = await fetch(`https://api.zippopotam.us/de/${zipCode}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          form.setError("location.zipCode", { type: "manual", message: t("invalidZip") })
          return
        }

        const data = await res.json()
        const place = data.places?.[0]
        if (!place) {
          form.setError("location.zipCode", { type: "manual", message: t("invalidZip") })
          return
        }

        form.setValue("location.city", place["place name"], { shouldValidate: true })
        form.setValue("location.state", place["state"], { shouldValidate: true })
      } catch {
        // istek iptal edildi
      } finally {
        setIsLookingUpZip(false)
      }
    }, 400)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [zipCode, form, t])

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-heading text-xl">{t("successTitle")}</h2>
        <p className="font-body text-sm text-muted-foreground">
          {t("successBody")}
        </p>
        <Link href="/login" className="mt-4">
          <Button>{t("login")}</Button>
        </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <Link href="/" aria-label={t("logoAria")} className="cursor-pointer">
              <Image className="w-50 tablet:w-70 desktop:w-50" src={logo} alt="Kitzaa Logo" />
            </Link>
            <div>
              <h2 className="font-heading text-2xl">{t("title")}</h2>
              <p className="font-body text-xs mt-2 ">{t("subtitle")}</p>
            </div>
          </div>
          
          <div className="w-full max-w-md">
            {/* STEPPER  */}
            <Stepper value={currentStep} onValueChange={setCurrentStep}>
              <StepperNav>
                {steps.map((step) => (
                  <StepperItem
                    key={step}
                    step={step}
                    className="first:rounded-s-full last:rounded-e-full flex-1 overflow-hidden transition-all duration-300"
                  >
                    <StepperTrigger className="w-full flex-col items-start gap-2 cursor-pointer">
                      <StepperIndicator className="bg-border h-2 w-full rounded-none!">
                        <span className="sr-only">{step}</span>
                      </StepperIndicator>
                    </StepperTrigger>
                  </StepperItem>
                ))}
              </StepperNav>

              <div className="flex items-center justify-between gap-2.5 pt-1">
                <Button
                  variant="link"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className={cn(
                    "px-0 cursor-pointer",
                    currentStep === 1 && "pointer-events-none opacity-0"
                  )}
                >
                  <ArrowLeftIcon className="size-4" />
                  {t("back")}
                </Button>

                <div className="text-sm font-medium">
                  <span className="text-foreground">{currentStep}</span>{" "}
                  <span className="text-muted-foreground/60">/ {steps.length}</span>
                </div>
              </div>
            </Stepper>
          </div>

          {currentStep === 1 ? (
            <div>
              <h2 className="font-heading text-xl mb-4">{t("stepPersonal")}</h2>
            </div>
          ) : (
            <div>
              <h2 className="font-heading text-xl mb-4">{t("stepLocation")}</h2>
            </div>
          )}

          {/* STEP 1  */}
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("firstName")}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder={t("firstNamePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("lastName")}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder={t("lastNamePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("username")}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder={t("usernamePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
        
              {/* 8. ŞİFRE ALANI name="newPassword" OLARAK GÜNCELLENDİ */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("password")}</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className="pr-9"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirmPassword")}</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className="pr-9"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <div className="flex gap-2">
                  <div
                    aria-label={t("countryCodeAria")}
                    className="flex h-9 w-20 items-center justify-center rounded-xl border border-input bg-input/30 text-base text-muted-foreground md:text-sm"
                  >
                    +49
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input id="phone" type="tel" placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="default"
                  className="cursor-pointer"
                  onClick={goToNextStep}
                  disabled={currentStep === steps.length}
                >
                  {t("next")}
                </Button>
              </div>
            </>
          )}

          {/* STEP 2  */}
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("zipCode")}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="12345" {...field} />
                      </FormControl>
                      {isLookingUpZip && (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Loader2 className="size-3 animate-spin" />
                          {t("zipLookup")}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("city")}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Berlin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("state")}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Baden-Württemberg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("district")}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Mitte" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("language")}</FormLabel>
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                      <button
                        type="button"
                        onClick={() => field.onChange("de")}
                        className={cn(
                          "cursor-pointer rounded-lg py-1.5 text-sm font-medium transition-colors",
                          field.value === "de"
                            ? "bg-background text-primary shadow-sm"
                            : "text-muted-foreground"
                        )}
                      >
                        {t("german")}
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("en")}
                        className={cn(
                          "cursor-pointer rounded-lg py-1.5 text-sm font-medium transition-colors",
                          field.value === "en"
                            ? "bg-background text-primary shadow-sm"
                            : "text-muted-foreground"
                        )}
                      >
                        {t("english")}
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <Field>
                <Button
                  type="submit"
                  className="cursor-pointer mt-6"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    t("submit")
                  )}
                </Button>
              </Field>

              {error && <p className="text-destructive text-sm text-center">{error.message}</p>}
              
            </>
          )}
        </FieldGroup>
      </form>
    </Form>
  )
}