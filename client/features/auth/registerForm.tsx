
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
  FieldSeparator,
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
import { ArrowLeftIcon, Check, Eye, EyeOff, Loader2 } from 'lucide-react'
import logo from "../../public/images/logo.png"
import Image from "next/image"
import Link from "next/link"
import { registerSchema, toRegisterPayload, type RegisterFormValues } from "./validations/register.schema"
import { useRegister } from "./hooks/useRegister"

const steps = [1, 2]

const STEP_1_FIELDS = [
  "firstName",
  "lastName",
  "username",
  "email",
  "password",
  "confirmPassword",
  "phone",
] as const


export function RegisterForm() {

  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLookingUpZip, setIsLookingUpZip] = useState(false)

  const { mutate: submitRegister, isPending, isSuccess, error } = useRegister()


  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
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
    const isStepValid = await form.trigger(STEP_1_FIELDS)  // burda sadece witer ya bastigimizda o alanlarin dogrulugunun kontrolünü yapiyoruz.
    if (isStepValid) setCurrentStep((prev) => prev + 1)
  }


  const onSubmit = async (data: RegisterFormValues) => {
    console.log("geldi onsubmite")
    const payload = toRegisterPayload(data)
    submitRegister(payload)

    console.log("kullanici olustu", payload)
  }


  useEffect(() => {

    if (!/^\d{5}$/.test(zipCode)) {
      form.clearErrors("location.zipCode")
      return
    }

    const controller = new AbortController()  // bir "iptal kumandası" oluşturuyor. İçinde bir .signal (bağlı bir "iptal sinyali") var.
    const timeoutId = setTimeout(async () => {
      setIsLookingUpZip(true)
      form.clearErrors("location.zipCode")
      try {
        const res = await fetch(`https://api.zippopotam.us/de/${zipCode}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          form.setError("location.zipCode", { type: "manual", message: "Diese Postleitzahl ist ungültig" })
          return
        }

        const data = await res.json()
        const place = data.places?.[0]
        if (!place) {
          form.setError("location.zipCode", { type: "manual", message: "Diese Postleitzahl ist ungültig" })
          return
        }

        form.setValue("location.city", place["place name"], { shouldValidate: true })
        form.setValue("location.state", place["state"], { shouldValidate: true })
      } catch {
        // istek iptal edildi (kullanıcı yazmaya devam etti) — sessizce geç.
      } finally {
        setIsLookingUpZip(false)
      }
    }, 400)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [zipCode, form])



  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-heading text-xl">E-Mail-Adresse bestätigen</h2>
        <p className="font-body text-sm text-muted-foreground">
          Wir haben dir einen Bestätigungslink geschickt. Bitte überprüfe dein Postfach.
        </p>
      </div>
    )
  }


  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <Link href="/" aria-label="Zur Startseite" className="cursor-pointer">
              <Image className="w-50 tablet:w-70 desktop:w-50" src={logo} alt="Kitzaa Logo" />
            </Link>
            <div>
              <h2 className="font-heading text-2xl">Neues Konto erstellen</h2>
              <p className="font-body text-xs mt-2 ">Schließe dich unserer Gemeinschaft an und finde die besten Events in deiner Nähe.</p>
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
                  Zurück
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
              <h2 className="font-heading text-xl mb-4">Persönliche Daten & Zugangsdaten</h2>
            </div>
          ) : (
            <div>
              <h2 className="font-heading text-xl mb-4">Standort & Präferenzen</h2>
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
                      <FormLabel>Vorname</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Max" {...field} />
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
                      <FormLabel>Nachname</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Mustermann" {...field} />
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
                    <FormLabel>Nutzername</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="familien_held" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail Adresse</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="hallo@beispiel.de" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passwort</FormLabel>
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
                        aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
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
                    <FormLabel>Passwort bestätigen</FormLabel>
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
                        aria-label={showConfirmPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Telefonnummer (Optional)</Label>
                <div className="flex gap-2">
                  <div
                    aria-label="Ländervorwahl"
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
                  variant="default"
                  className="cursor-pointer"
                  onClick={goToNextStep}
                  disabled={currentStep === steps.length}
                >
                  Weiter
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
                      <FormLabel>Postleitzahl</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="12345" {...field} />
                      </FormControl>
                      {isLookingUpZip && (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Loader2 className="size-3 animate-spin" />
                          Stadt wird gesucht...
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
                      <FormLabel>Stadt</FormLabel>
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
                      <FormLabel>Bundesland</FormLabel>
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
                      <FormLabel>Bezirk (Optional)</FormLabel>
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
                    <FormLabel>Sprache</FormLabel>
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
                        Deutsch
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
                        Englisch
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
                      Wird erstellt...
                    </>
                  ) : (
                    "Konto erstellen"
                  )}
                </Button>
              </Field>
              <FieldSeparator className="my-1">Oder weiter mit</FieldSeparator>

              {error && <p style={{ color: "red" }}>{error.message}</p>}

              <Field>
                <Button variant="outline" type="button" className="cursor-pointer mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Mit Google registrieren
                </Button>
                <FieldDescription className="px-6 text-center">
                  Du hast bereits ein Konto? <a href="#" className="cursor-pointer">Anmelden</a>
                </FieldDescription>
              </Field>
            </>
          )}
        </FieldGroup>
      </form>
    </Form>
  )
}
