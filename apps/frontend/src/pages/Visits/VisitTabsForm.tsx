import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardListIcon, FootprintsIcon } from "lucide-react";
import ReservationForm from "../ReservationsPage/ReservationForm";
import { Separator } from "@/components/ui/separator";
import WalkInForm from "../Walk-In/WalkInForm";

export default function VisitTabsForm() {
  return (
    <Tabs defaultValue="reservation-booking" className="mx-auto">
      <TabsList>
        <TabsTrigger value="reservation-booking">
          <ClipboardListIcon
            className="mx-0.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          Reservasi (Booking)
        </TabsTrigger>
        <TabsTrigger value="walk-in">
          <FootprintsIcon
            className="mx-0.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          Langsung (Walk-in)
        </TabsTrigger>
      </TabsList>
      <Separator />
      <TabsContent value="reservation-booking">
        <ReservationForm />
      </TabsContent>
      <TabsContent value="walk-in">
        <WalkInForm />
      </TabsContent>
    </Tabs>
  );
}
