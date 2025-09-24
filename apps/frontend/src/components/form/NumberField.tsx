import { Info, MinusIcon, PlusIcon } from "lucide-react";
import {
  Button,
  Group,
  Input,
  Label,
  NumberField,
} from "react-aria-components";
import { FormField } from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useId } from "react";

type NumberFieldInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  tooltip?: string | React.ReactNode;
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  disabled?: boolean;
};

export function NumberFieldInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  tooltip,
  minValue = 0,
  maxValue,
  defaultValue,
  disabled = false,
}: NumberFieldInputProps<T>) {
  const id = useId();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <NumberField
          id={id}
          value={field.value}
          onChange={field.onChange}
          defaultValue={defaultValue}
          minValue={minValue}
          maxValue={maxValue}
          isDisabled={disabled}
        >
          <div className="*:not-first:mt-2">
            {/* Label + Tooltip */}
            <div className="flex items-center gap-1">
              <Label className="text-foreground text-sm font-medium">
                {label}
              </Label>
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      size={14}
                      className="text-muted-foreground cursor-pointer mt-0.5"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {typeof tooltip === "string" ? <p>{tooltip}</p> : tooltip}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Input group */}
            <Group className="data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-xs border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:opacity-50 disabled:bg-neutral-200 data-focus-within:ring-[2px] border-black">
              <Button
                slot="decrement"
                className="bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground hover:cursor-pointer -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-xs border border-black text-sm transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-300"
                isDisabled={disabled}
              >
                <MinusIcon size={16} aria-hidden="true" />
              </Button>
              <Input
                className="bg-background text-foreground w-full grow px-3 py-2 text-center tabular-nums disabled:cursor-not-allowed disabled:bg-neutral-200"
                placeholder={placeholder}
                disabled={disabled}
              />
              <Button
                slot="increment"
                className="bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground hover:cursor-pointer -me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-xs border border-black text-sm transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-300"
                isDisabled={disabled}
              >
                <PlusIcon size={16} aria-hidden="true" />
              </Button>
            </Group>
          </div>
        </NumberField>
      )}
    />
  );
}
