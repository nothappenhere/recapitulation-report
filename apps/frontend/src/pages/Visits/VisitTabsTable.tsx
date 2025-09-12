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
import ReservationTable from "../ReservationsPage/ReservationTable";

export default function VisitTabsTable() {
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

      <TabsContent value="reservation-booking">
        <ReservationTable />
      </TabsContent>

      <TabsContent value="walk-in">
        <Card>
          <CardHeader>
            <CardTitle>Card Title Wal-in</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
