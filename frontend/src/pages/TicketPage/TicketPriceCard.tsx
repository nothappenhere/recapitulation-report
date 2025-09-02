import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/formatter";
import { ColumnsActions } from "../ReservationsPage/column-actions";
import { useNavigate } from "react-router";

function TicketPriceCard({ ticketPrice, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <Card className="@container/card hover:bg-neutral-100">
      <CardHeader>
        <CardDescription>
          Harga Tiket golongan{" "}
          <Badge variant={"outline"}>{ticketPrice.category}</Badge>
        </CardDescription>
        <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
          {formatRupiah(ticketPrice.unitPrice)}
        </CardTitle>

        <CardAction className="border rounded-sm">
          <ColumnsActions
            item={ticketPrice}
            getId={(tp) => tp._id || ""}
            onEdit={(tp) => navigate(`/dashboard/ticket-price/${tp._id}`)}
            onDelete={onDelete}
          />
        </CardAction>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="font-medium after:content-['*'] after:text-red-500">
          Harga berlaku setiap kunjungan
        </div>
        <div className="text-muted-foreground">Berdasarkan PP ...</div>
      </CardFooter>
    </Card>
  );
}

export default TicketPriceCard;
