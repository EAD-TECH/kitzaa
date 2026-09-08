"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeftIcon, ArrowRightIcon, CalendarClock, CheckIcon, PenLine, Wallet, X } from "lucide-react"

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/reui/stepper"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import { createEventSchema, type CreateEventFormValues } from "../../validations/event.schema"
import type { CreateEventFieldName, CreateEventFormInput, CreateEventStepMeta } from "../../types/createEvent.types"
import type { EventCategoryDTO } from "../../types/eventCategory.types"
import { useCreateEvent } from "../../hooks/useCreateEvent"
import { EventDetailsStep } from "./EventDetailsStep"
import { EventScheduleStep } from "./EventScheduleStep"
import { EventPricingStep } from "./EventPricingStep"

const STEPS: CreateEventStepMeta[] = [
  { id: 1, label: "Details", title: "Event-Details" },
  { id: 2, label: "Zeitplan", title: "Zeitplan & Ort" },
  { id: 3, label: "Preise", title: "Preise & Kapazität festlegen" },
]

const STEP_ICONS = { 1: PenLine, 2: CalendarClock, 3: Wallet } as const

const STEP_1_FIELDS: CreateEventFieldName[] = ["title", "categoryId", "locationType", "ageRange", "description"]

const STEP_2_FIELDS: CreateEventFieldName[] = [
  "schedule.startDate",
  "schedule.endDate",
  "schedule.startTime",
  "schedule.endTime",
  "schedule.isRecurring",
  "schedule.recurrenceRule",
  "location.venueName",
  "location.addressLine",
  "location.city",
  "location.state",
  "location.zipCode",
  "location.coordinates",
]

const DEFAULT_VALUES: CreateEventFormInput = {
  title: "",
  description: "",
  coverImage: null,
  images: [],
  categoryId: "",
  locationType: "indoor",
  ageRange: "all-ages",
  isFree: true,
  price: null,
  schedule: {
    startDate: new Date(),
    endDate: null,
    startTime: "",
    endTime: "",
    isRecurring: false,
    recurrenceRule: null,
  },
  location: {
    venueName: "",
    addressLine: "",
    city: "",
    state: "",
    zipCode: "",
    country: "DE",
    coordinates: { lat: 52.52, lng: 13.405 },
  },
  capacity: { max: NaN },
}

interface CreateEventWizardProps {
  categories: EventCategoryDTO[]
}

export function CreateEventWizard({ categories }: CreateEventWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const { mutate: createEvent, isPending } = useCreateEvent()

  const form = useForm<CreateEventFormInput, unknown, CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    mode: "onSubmit",
    defaultValues: DEFAULT_VALUES,
  })

  const goToNextStep = async () => {
    const fields = currentStep === 1 ? STEP_1_FIELDS : STEP_2_FIELDS
    const isStepValid = await form.trigger(fields)
    if (isStepValid) setCurrentStep((prev) => prev + 1)
  }

  const goToPreviousStep = () => setCurrentStep((prev) => prev - 1)

  const onSubmit = (data: CreateEventFormValues) => {
    createEvent(data, {
      onSuccess: () => {
        toast.success("Event wurde erstellt und wartet auf Freigabe.")
        router.push("/profile/meine-events")
      },
    })
  }

  const activeStepMeta = STEPS[currentStep - 1]
  const ActiveIcon = STEP_ICONS[currentStep as 1 | 2 | 3]

  return (
    <div
      className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 tablet:px-6 tablet:py-10 **:data-[slot=form-item]:gap-3"
      style={{ "--destructive": "color-mix(in oklch, var(--red-500), black 20%)" } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground tablet:text-3xl">
            Eine Aktivität hosten
          </h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Erstelle eine Aktivität für Kinder und Familien in deiner Nähe – von Ausflug bis Workshop. In
            wenigen Schritten fertig.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href="/profile" aria-label="Schließen" />}
            nativeButton={false}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <Stepper value={currentStep} onValueChange={setCurrentStep} indicators={{ completed: <CheckIcon className="size-3.5" /> }}>
        <StepperNav>
          {STEPS.map((step, index) => (
            <StepperItem key={step.id} step={step.id} completed={step.id < currentStep}>
              <StepperTrigger className="flex-col gap-2">
                <StepperIndicator>{step.id}</StepperIndicator>
                <StepperTitle className="hidden text-xs tablet:block">{step.label}</StepperTitle>
              </StepperTrigger>
              {index < STEPS.length - 1 && <StepperSeparator />}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>

      <Form {...form}>
        <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ActiveIcon className="size-4 text-primary" />
                {activeStepMeta.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && <EventDetailsStep form={form} categories={categories} />}
              {currentStep === 2 && <EventScheduleStep form={form} />}
              {currentStep === 3 && <EventPricingStep form={form} />}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={goToPreviousStep}
              className={cn(
                "bg-(--green-500)/20 text-[color-mix(in_oklch,var(--green-500),black_35%)] hover:bg-(--green-500)/30",
                currentStep === 1 && "pointer-events-none opacity-0"
              )}
            >
              <ArrowLeftIcon className="size-4" />
              Zurück
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={goToNextStep}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Nächster Schritt
                <ArrowRightIcon className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <CheckIcon className="size-4" />
                {isPending ? "Wird veröffentlicht…" : "Event veröffentlichen"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
