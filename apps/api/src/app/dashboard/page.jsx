"use client";

import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";
import Achievements from "@/components/Achievements";
import CardProgress from "@/components/CardProgress";

export default function page() {
  return (
    <AppLayout>
      <Topbar />

      <Achievements />
      <CardProgress />
    </AppLayout>
  );
}
