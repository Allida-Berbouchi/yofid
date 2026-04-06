import ResourceViewer from "@/components/ResourceViewer";
export default async function ResourcePage({ params }) {
    const { resourceId } = await params;
    return (<main className="max-w-4xl mx-auto">
      <ResourceViewer resourceId={resourceId}/>
    </main>);
}
