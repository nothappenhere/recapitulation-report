import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  Control,
  FieldValues,
  Path,
  ControllerRenderProps,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { Info } from "lucide-react";

type SimpleFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  /** untuk formatting tampilan value (misal Rupiah) */
  valueFormatter?: (value: any) => string;
  /** bisa Input, Textarea, Select, dll. */
  component?: React.ReactElement;
  /** override onChange (misal handle rupiah -> angka) */
  onChangeOverride?: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<T, Path<T>>
  ) => void;
  /** tooltip opsional untuk penjelasan singkat */
  tooltip?: string | React.ReactNode;
};

export function SimpleField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  valueFormatter,
  component,
  onChangeOverride,
  tooltip,
}: SimpleFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-1">
            <FormLabel>{label}</FormLabel>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    size={14}
                    className="text-muted-foreground cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {typeof tooltip === "string" ? <p>{tooltip}</p> : tooltip}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <FormControl>
            {component ? (
              React.cloneElement(component, {
                placeholder: placeholder,
                ...field,
                onChange: (value: any) =>
                  onChangeOverride
                    ? onChangeOverride(value, field)
                    : field.onChange(value),
              })
            ) : (
              <Input
                className="disabled:bg-neutral-300"
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                value={
                  valueFormatter
                    ? valueFormatter(field.value)
                    : field.value ?? ""
                }
                onChange={(e) => {
                  if (onChangeOverride) {
                    onChangeOverride(e, field);
                  } else {
                    field.onChange(e);
                  }
                }}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
