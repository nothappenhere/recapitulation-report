import { ControlledField } from "./ControlledField";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

type SelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  icon?: LucideIcon;
  options: { value: string; label: string; disabled?: boolean }[];
  tooltip?: string | ReactNode;
  disabled?: boolean;
  countrySelect: boolean;
};

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  icon: Icon,
  options,
  tooltip,
  disabled,
  countrySelect,
}: SelectFieldProps<T>) {
  return (
    <ControlledField
      control={control}
      name={name}
      label={label}
      tooltip={tooltip}
    >
      {(field) => (
        <Select
          onValueChange={field.onChange}
          value={field.value}
          disabled={disabled}
        >
          <SelectTrigger className="relative ps-10 w-full max-w-full truncate">
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
              {Icon && <Icon size={16} aria-hidden="true" />}
            </div>
            <SelectValue placeholder={placeholder} className="truncate" />
          </SelectTrigger>
          <SelectContent className="">
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="truncate"
                disabled={opt.disabled}
              >
                {countrySelect ? (
                  <>
                    <span className="text-base leading-none">{opt.label}</span>
                    <span className="truncate text-muted-foreground">
                      {opt.value}
                    </span>
                  </>
                ) : (
                  opt.label
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </ControlledField>
  );
}
