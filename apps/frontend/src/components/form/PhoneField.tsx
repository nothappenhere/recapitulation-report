import * as React from "react";
import { useId } from "react";
import { PhoneIcon, ChevronDownIcon, Check, Info } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";

type PhoneFieldProps<T extends Record<string, any>> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  tooltip?: string | React.ReactNode;
  disabled?: boolean;
};

export function PhoneField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Masukkan nomor telepon",
  tooltip,
  disabled = false,
}: PhoneFieldProps<T>) {
  const id = useId();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Label htmlFor={id}>{label}</Label>
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

          <RPNInput.default
            id={id}
            className="flex rounded-xs shadow-xs"
            international
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            disabled={disabled}
            flagComponent={FlagComponent}
            countrySelectComponent={CountrySelect}
            inputComponent={PhoneInput}
          />
        </div>
      )}
    />
  );
}

/* ----------------- Custom Input ------------------ */
const PhoneInput = ({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <Input
      data-slot="phone-input"
      className={cn(
        "-ms-px rounded-s-none rounded-xs shadow-none focus-visible:z-10",
        className
      )}
      {...props}
    />
  );
};
PhoneInput.displayName = "PhoneInput";

/* ----------------- Custom Country Select ------------------ */
type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false);
  // const selected = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="border-black rounded-e-none rounded-xs disabled:cursor-not-allowed disabled:bg-neutral-200"
        >
          <span className="inline-flex items-center gap-1">
            <FlagComponent country={value} countryName={value} />
            <ChevronDownIcon size={12} aria-hidden="true" />
          </span>
          <span className="sr-only">Pilih negara</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Cari negara..." className="h-9" />
          <CommandList>
            <CommandEmpty>Tidak ada negara ditemukan.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((opt) => opt.value)
                .map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => {
                      onChange(opt.value as RPNInput.Country);
                      setOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FlagComponent
                        country={opt.value!}
                        countryName={opt.label}
                      />
                      <span>{opt.label}</span>

                      <span className="ml-auto text-muted-foreground">
                        +{RPNInput.getCountryCallingCode(opt.value!)}
                      </span>
                    </span>

                    {opt.value === value && (
                      <Check className="ml-auto h-4 w-4 opacity-100" />
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/* ----------------- Custom Flag ------------------ */
const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];
  return (
    <span className="w-5 overflow-hidden">
      {Flag ? <Flag title={countryName} /> : <PhoneIcon size={16} />}
    </span>
  );
};
