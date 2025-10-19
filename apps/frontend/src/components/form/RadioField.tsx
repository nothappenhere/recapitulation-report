import { ControlledField } from "./ControlledField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import type { Control, FieldValues, FieldPath } from "react-hook-form";
import type { ReactNode } from "react";

type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type RadioFieldProps<T extends Record<string, any>> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: RadioOption[];
  orientation?: "row" | "col"; // tambahan: horizontal/vertical
  disabled?: boolean;
  tooltip?: string | ReactNode;
};

export function RadioField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  orientation = "col",
  disabled,
  tooltip,
}: RadioFieldProps<T>) {
  return (
    <ControlledField
      control={control}
      name={name}
      label={label}
      tooltip={tooltip}
    >
      {(field) => (
        <RadioGroup
          onValueChange={field.onChange}
          value={field.value}
          className={
            orientation === "row"
              ? "flex flex-row gap-6"
              : "flex flex-col gap-3"
          }
        >
          {options.map((opt) => (
            <FormItem
              key={opt.value}
              className="flex items-center gap-2 space-y-0"
            >
              <FormControl>
                <RadioGroupItem
                  value={opt.value}
                  disabled={disabled || opt.disabled}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                {opt.label}
              </FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      )}
    </ControlledField>
  );
}
