export default function FullpageSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500"></div>
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-slate-300">
          Just a moment...
        </p>
      </div>
    </div>
  );
}
