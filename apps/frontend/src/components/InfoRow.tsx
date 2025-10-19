type InfoRowProps = {
  label: string;
  value: string | number;
};

export function InfoRow({ label, value }: InfoRowProps) {
  // Match label dalam format: "Bahasa Indonesia (Bahasa Inggris)"
  const match = label.match(/^(.*?)\s*\((.*?)\)$/);
  const labelIndo = match ? match[1] : label;
  const labelEng = match ? match[2] : null;

  return (
    <div className="grid grid-cols-[115px_max-content_1fr] gap-x-1 gap-y-0.5 items-start">
      <div className="flex flex-col">
        <span>{labelIndo}</span>
        {labelEng && <span className="italic text-[11px]">({labelEng})</span>}
      </div>
      <span>:</span>
      <span>{value}</span>
    </div>
  );
}
