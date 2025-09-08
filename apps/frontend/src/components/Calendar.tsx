import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

function CalendarComponent() {
  const [date, setDate] = useState(new Date());

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      selected={date}
      onSelect={setDate}
      disabled={{
        before: new Date(),
      }}
      className="rounded-lg border shadow-sm"
    />
  );
}

export { CalendarComponent };
