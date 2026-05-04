
interface StaticPageProps {
  title: string;
  description: string;
}

export default function StaticPage({ title, description }: StaticPageProps) {
  return (
    <div className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-[32px] font-semibold tracking-tight text-gray-900 dark:text-white transition-colors">
        {title}
      </h1>
      <p className="text-[14px] font-medium text-[#968C8C] dark:text-gray-400 transition-colors">
        {description}
      </p>
    </div>
  );
}
