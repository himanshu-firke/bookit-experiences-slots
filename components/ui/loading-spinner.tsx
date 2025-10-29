export function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div className={`${sizes[size]} border-gray-300 border-t-[#FFD643] rounded-full animate-spin ${className}`}></div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white border border-gray-200 rounded-lg overflow-hidden" style={{ width: "280px", height: "312px" }}>
      <div className="bg-gray-200" style={{ height: "160px" }}></div>
      <div className="p-3 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="pt-2">
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
