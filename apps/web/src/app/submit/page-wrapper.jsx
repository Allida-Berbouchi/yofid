import { Suspense } from "react";
import SubmitResourceContent from "./submit-content";
export default function SubmitResourcePage() {
    return (<Suspense fallback={<LoadingPage />}>
      <SubmitResourceContent />
    </Suspense>);
}
function LoadingPage() {
    return (<>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <span className="text-2xl font-bold text-blue-600">Yovid</span>
        </div>
      </nav>
      <main className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    </>);
}
