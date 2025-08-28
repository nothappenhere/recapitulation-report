import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SquarePen, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/formatRupiah";

function TicketPriceCard({ ticketPrice, onEdit, onDelete }) {
  return (
    <Card className="@container/card hover:bg-neutral-100">
      <CardHeader>
        <CardDescription>
          Tiket untuk golongan{" "}
          <Badge variant={"outline"}>{ticketPrice.group}</Badge>
        </CardDescription>
        <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
          {formatRupiah(ticketPrice.unitPrice)}
        </CardTitle>

        <CardAction className="flex gap-2">
          <Badge
            onClick={() => onEdit(true)}
            className="py-1.5 bg-blue-500 hover:bg-blue-600 text-white hover:cursor-pointer"
          >
            <SquarePen />
            Edit
          </Badge>

          <Badge
            onClick={() => onDelete(true)}
            className="py-1.5 bg-rose-500 hover:bg-rose-600 text-white hover:cursor-pointer"
          >
            <Trash2 />
            Hapus
          </Badge>
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
