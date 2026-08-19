
import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"


export interface FilterCheckBoxGroupProps {
    name: string,
    title: string,
    icon?: React.ReactNode,
    options: string[],
    selected: string[],
    onChange: (selected: string[]) => void
}




export function FilterCheckboxGroup({
    name,
    title,
    icon,
    options,
    selected,
    onChange
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
            <FieldGroup className="gap-3">
                {options.map((option) => {
                    const id = `${name}-${option}`
                    return (
                        <Field
                            key={option}
                            orientation="horizontal"
                            className="-mx-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted/60"
                        >
                            <Checkbox
                                id={id}
                                checked={selected.includes(option)}
                                onCheckedChange={() => toggle(option)}
                            />
                            <FieldLabel htmlFor={id} className="cursor-pointer font-normal">
                                {option}
                            </FieldLabel>
                        </Field>
                    )
                })}
            </FieldGroup>
        </FieldSet>
    )
}
