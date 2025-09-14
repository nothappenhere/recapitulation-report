import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardListIcon, FootprintsIcon } from "lucide-react";
import ReservationForm from "../ReservationsPage/ReservationForm";
import WalkInForm from "../Walk-In/WalkInForm";
import { useSearchParams } from "react-router";

export default function VisitTabsForm() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "walk-in";

  return (
    <Tabs defaultValue={tab} className="mx-auto">
      <TabsList className="mb-3 gap-1">
        <TabsTrigger value="walk-in">
          <FootprintsIcon
            className="mx-0.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          Langsung (Walk-in)
        </TabsTrigger>
        <TabsTrigger value="reservation-booking">
          <ClipboardListIcon
            className="mx-0.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          Reservasi (Booking)
        </TabsTrigger>
      </TabsList>

      <TabsContent value="walk-in">
        <WalkInForm />
      </TabsContent>
      <TabsContent value="reservation-booking">
        <ReservationForm />
      </TabsContent>
    </Tabs>
  );
}
