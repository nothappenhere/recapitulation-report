import { Check, ChevronsUpDown } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ControlledField } from "./ControlledField";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

type ComboboxFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  icon?: LucideIcon;
  options: { value: string; label: string; disabled?: boolean }[];
  tooltip?: string | React.ReactNode;
  disabled?: boolean;
  countrySelect?: boolean;
};

export function ComboboxField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  icon: Icon,
  options,
  tooltip,
  disabled,
  countrySelect = false,
}: ComboboxFieldProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <ControlledField
      control={control}
      name={name}
      label={label}
      tooltip={tooltip}
    >
      {(field) => {
        const selected = options.find((opt) => opt.value === field.value);

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                disabled={disabled}
                className={cn(
                  "relative w-full min-w-0 justify-between ps-10 border-black rounded-xs disabled:cursor-not-allowed disabled:bg-neutral-200",
                  !field.value && "text-muted-foreground"
                )}
              >
                {/* Icon di kiri */}
                {Icon && (
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                    <Icon size={16} aria-hidden="true" />
                  </div>
                )}

                {/* Label / placeholder dengan tooltip kalau kepotong */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ps-7 font-normal flex-1 truncate text-left">
                        {selected
                          ? countrySelect
                            ? `${selected.label} - ${selected.value}` // contoh: "ID - Indonesia"
                            : selected.label
                          : placeholder}
                      </span>
                    </TooltipTrigger>
                    {selected && (
                      <TooltipContent side="top">
                        {countrySelect
                          ? `${selected.label} - ${selected.value}`
                          : selected.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>

                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder={`Cari ${label.toLowerCase()}...`}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>Tidak ada data ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={countrySelect ? opt.value : opt.label}
                        disabled={opt.disabled}
                        onSelect={() => {
                          field.onChange(opt.value);
                          setOpen(false);
                        }}
                        className="flex items-center gap-2"
                      >
                        {countrySelect ? (
                          <>
                            <span className="text-base leading-none">
                              {opt.label}
                            </span>
                            <span className="truncate text-muted-foreground">
                              {opt.value}
                            </span>
                          </>
                        ) : (
                          opt.label
                        )}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            opt.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    </ControlledField>
  );
}
