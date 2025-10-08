import { ControlledField } from "./ControlledField";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Control, FieldValues, FieldPath } from "react-hook-form";
import { Label } from "@/components/ui/label";
import type { ReactNode } from "react";
import { Info } from "lucide-react";

type CheckboxFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  tooltip?: string | ReactNode;
};

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  tooltip,
}: CheckboxFieldProps<T>) {
  return (
    <ControlledField control={control} name={name} label={""}>
      {(field) => (
        <div className="flex items-center gap-2">
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(!!checked)}
            className="border border-black"
          />
          <Label htmlFor={name}>{label}</Label>
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
      )}
    </ControlledField>
  );
}
