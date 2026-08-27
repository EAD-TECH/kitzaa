
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"


export interface FilterCheckBoxOption {
    label: string
    value: string
}

export interface FilterCheckBoxGroupProps {
    name: string,
    title: string,
    icon?: React.ReactNode,
    options: FilterCheckBoxOption[],
    selected: string[],
    onChange: (selected: string[]) => void,
    columns?: 1 | 2
}




export function FilterCheckboxGroup({
    name,
    title,
    icon,
    options,
    selected,
    onChange,
    columns = 1
}: FilterCheckBoxGroupProps) {


    const toggle = (value: string) => {
        const next = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value]

        onChange(next)
    }



    return (
        <FieldSet>
            <FieldLegend
                variant="label"
                className="flex items-center gap-1.5 font-heading text-xs font-medium tracking-wide text-foreground uppercase"
            >
                {icon}
                {title}
            </FieldLegend>
            <FieldGroup className={cn("gap-3", columns === 2 && "grid grid-cols-2 gap-x-4")}>
                {options.map((option) => {
                    const id = `${name}-${option.value}`
                    return (
                        <Field
                            key={option.value}
                            orientation="horizontal"
                            className="-mx-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted/60"
                        >
                            <Checkbox
                                id={id}
                                checked={selected.includes(option.value)}
                                onCheckedChange={() => toggle(option.value)}
                            />
                            <FieldLabel htmlFor={id} className="cursor-pointer font-normal">
                                {option.label}
                            </FieldLabel>
                        </Field>
                    )
                })}
            </FieldGroup>
        </FieldSet>
    )
}
