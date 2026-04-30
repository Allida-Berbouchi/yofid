import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import ResourceViewer from "@/components/ResourceViewer";
import Topbar from "@/components/Topbar";
import ResourceInteraction from "@/components/ResourceInteraction";

export default async function WatchPage({ searchParams }) {
  const params = await searchParams;
  const resourceId = typeof params?.id === "string" ? params.id.trim() : "";

  return (
    <AppLayout>
      <Topbar />

      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto w-full max-w-[1220px] px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
          {resourceId ? (
            <div className="space-y-5">
              <ResourceViewer resourceId={resourceId} />
              <ResourceInteraction resourceId={resourceId} />
            </div>
          ) : (
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h1 className="text-xl font-bold text-slate-950">
                No content found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                No content ID was provided. Go back home and choose a resource
                to watch.
              </p>

              <Link
                href="/home"
                className="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Back to home
              </Link>
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}