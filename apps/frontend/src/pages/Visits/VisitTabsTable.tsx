import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardListIcon, FootprintsIcon } from "lucide-react";
import WalkInTable from "../Walk-In/WalkInTable";
import ReservationTable from "../ReservationsPage/ReservationTable";

export default function VisitTabsTable() {
  return (
    <Tabs defaultValue="walk-in" className="mx-auto">
      <TabsList className="gap-1">
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
        <WalkInTable />
      </TabsContent>
      <TabsContent value="reservation-booking">
        <ReservationTable />
      </TabsContent>
    </Tabs>
  );
}
