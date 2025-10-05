import { ControlledField } from "./ControlledField";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";

type RangeFieldProps<T extends FieldValues> = {
  control: Control<T>;
  minName: Path<T>;
  maxName: Path<T>;
  label: string;
  placeholder: [string, string];
  type?: string;
  disabled?: boolean;
  tooltip?: string | React.ReactNode;
  disableMin?: boolean;
};

export function RangeField<T extends FieldValues>({
  control,
  minName,
  maxName,
  label,
  placeholder,
  type = "number",
  tooltip,
  disableMin,
}: RangeFieldProps<T>) {
  return (
    <ControlledField
      control={control}
      name={minName}
      label={label}
      tooltip={tooltip}
    >
      {(minField) => (
        <div className="flex">
          {/* Input Min (aktif) */}
          <Input
            className="flex-1 rounded-s-xs rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
            type={type}
            placeholder={placeholder[0]}
            disabled={disableMin}
            {...minField}
          />

          {/* Input Max (aktif) */}
          <Controller
            control={control}
            name={maxName}
            render={({ field }) => (
              <Input
                className="-ms-px flex-1 rounded-s-none rounded-e-xs [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                type={type}
                placeholder={placeholder[1]}
                {...field}
              />
            )}
          />
        </div>
      )}
    </ControlledField>
  );
}
