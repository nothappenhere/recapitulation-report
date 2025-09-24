type InfoRowProps = {
  label: string;
  value: string | number;
};

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="grid grid-cols-[115px_1fr] gap-1">
      <span className="break-words break-all whitespace-normal">{label}</span>
      <span className="break-words break-all whitespace-normal">
        : {value}
      </span>
    </div>
  );
}
