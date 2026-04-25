import Link from "next/link";

import AppLayout from "@/components/AppLayout";
import ResourceViewer from "@/components/ResourceViewer";
import Topbar from "@/components/Topbar";

export default async function WatchPage({ searchParams }) {
  const params = await searchParams;
  const resourceId = params?.id;

  return (
    <AppLayout>
      <Topbar />
      <div className="page-shell">
        

        {resourceId ? (
          <ResourceViewer resourceId={resourceId} />
        ) : (
          <div className="section-card" style={{ padding: 28 }}>
            <p style={{ marginBottom: 12, color: "#5d6c84" }}>
              No content ID was provided. Open this page from a content card to load the selected item.
            </p>
            <Link href="/home" className="btn-primary">
              Back to home
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
