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
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { type ReactNode } from "react";
import { Info } from "lucide-react";

type ControlledFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  tooltip?: string | ReactNode;
  children: (field: any) => ReactNode; // fleksibel
};

export function ControlledField<T extends FieldValues>({
  control,
  name,
  label,
  tooltip,
  children,
}: ControlledFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-1 flex-1">
            <FormLabel>{label}</FormLabel>
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
          <FormControl>{children(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
