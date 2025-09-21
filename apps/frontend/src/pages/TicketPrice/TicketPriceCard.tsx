import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@rzkyakbr/libs";
import { ColumnsActions } from "@/components/table/column-actions";
import { useNavigate } from "react-router";

type TicketPrice = {
  _id: string;
  category: string;
  unitPrice: number;
};

type TicketPriceCardProps = {
  ticketPrice: TicketPrice;
  onEdit: (ticketPrice: TicketPrice) => void;
  onDelete: () => void;
};

export function TicketPriceCard({
  ticketPrice,
  onDelete,
}: TicketPriceCardProps) {
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
            getId={(item: TicketPrice) => item._id}
            onEdit={(item: TicketPrice) =>
              navigate(`/dashboard/ticket-price/edit/${item._id}`)
            }
            onDelete={onDelete}
          />
        </CardAction>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="font-medium after:content-['*'] after:text-red-500">
          Harga berlaku setiap kunjungan
        </div>
        <div className="text-muted-foreground">
          Berdasarkan Peraturan Pemerintah No. 19 Tahun 2025 tentang Jenis Tarif
          Atas Penerimaan Negara Bukan Pajak yang berlaku pada Kementerian
          Energi dan Sumber Daya Mineral.
        </div>
      </CardFooter>
    </Card>
  );
}
