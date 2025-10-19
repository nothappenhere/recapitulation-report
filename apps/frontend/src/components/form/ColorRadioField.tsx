import { ControlledField } from "./ControlledField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { Control, FieldValues, FieldPath } from "react-hook-form";

type ColorOption = {
  value: string;
  label: string;
  bgClass: string;
  borderClass: string;
};

type ColorRadioFieldProps<T extends Record<string, any>> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: ColorOption[];
  tooltip?: string | ReactNode;
};

export function ColorRadioField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  tooltip,
}: ColorRadioFieldProps<T>) {
  return (
    <ControlledField
      control={control}
      name={name}
      label={label}
      tooltip={tooltip}
    >
      {(field) => (
        <RadioGroup
          value={field.value}
          onValueChange={field.onChange}
          className="flex gap-1.5"
        >
          {options.map((opt) => (
            <RadioGroupItem
              key={opt.value}
              value={opt.value}
              id={`color-${opt.value}`}
              aria-label={opt.label}
              className={cn(
                "size-6 rounded-full shadow-none",
                opt.bgClass,
                opt.borderClass
              )}
            />
          ))}
        </RadioGroup>
      )}
    </ControlledField>
  );
}
