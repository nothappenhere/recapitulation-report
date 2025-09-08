"use client";

import { useState } from "react";
import WeeklyReportForm from "@/components/WeeklyReportForm";
import WeeklyReportTable from "@/components/WeeklyReportTable";

export default function WeeklyReportPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="space-y-6">
      <WeeklyReportForm onSuccess={() => setRefresh((prev) => prev + 1)} />
      <WeeklyReportTable refreshTrigger={refresh} />
    </div>
  );
}
