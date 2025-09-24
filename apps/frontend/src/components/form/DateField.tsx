import { ControlledField } from "./ControlledField";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type DateFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  tooltip?: string | ReactNode;
  disabled?: boolean;
  disabledForward?: boolean;
};

export function DateField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  tooltip,
  disabled,
  disabledForward,
}: DateFieldProps<T>) {
  return (
    <ControlledField
      control={control}
      name={name}
      label={label}
      tooltip={tooltip}
    >
      {(field) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                "border-black rounded-xs font-normal relative w-full text-left disabled:cursor-not-allowed disabled:bg-neutral-200",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value instanceof Date && !isNaN(field.value.getTime()) ? (
                format(field.value, "PPP", { locale: id })
              ) : (
                <span>{placeholder}</span>
              )}
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                <CalendarIcon size={16} aria-hidden="true" />
              </div>
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={field.value as Date | undefined}
              onSelect={(date) => {
                field.onChange(date ?? null); // null kalau kosong
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const minDate = new Date("1900-01-01");

                const isBeforeMinDate = date < minDate;
                const isFriday = date.getDay() === 5; // 5 = Jumat
                const isAfterToday = date > today;
                const isBeforeToday = date < today;

                if (disabledForward) {
                  return (
                    isBeforeMinDate || isBeforeToday || isAfterToday || isFriday
                  );
                } else {
                  return isBeforeMinDate || isBeforeToday || isFriday;
                }
              }}
              captionLayout="dropdown"
              locale={id}
            />
          </PopoverContent>
        </Popover>
      )}
    </ControlledField>
  );
}
