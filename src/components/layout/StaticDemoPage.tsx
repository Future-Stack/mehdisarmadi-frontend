import { Badge } from "@/components/ui";

interface StaticPageProps {
  title: string;
  description: string;
}

export default function StaticPage({ title, description }: StaticPageProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        <Badge variant="warning" className="px-3 py-1">
          Demo Page
        </Badge>
      </div>

      <div className="grid gap-6">
        <div className="card-premium p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/50">
              <svg className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Component Library Under Construction
            </h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              This module is being architected for high performance and scale. Real data integration will begin once the backend APIs are finalized.
            </p>
            <button className="mt-6 rounded-xl bg-secondary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-secondary/20">
              Explore Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
