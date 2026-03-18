export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex flex-col md:flex-row md:gap-0 gap-8">
        {/* Left — image skeleton */}
        <div className="w-full md:w-[45%]">
          <div className="bg-rule rounded-lg aspect-[4/5] animate-pulse" />
        </div>
        {/* Right — content skeleton */}
        <div className="w-full md:w-[55%] px-0 md:px-8 py-0 md:py-6 space-y-4">
          <div className="h-3 w-20 bg-rule rounded animate-pulse" />
          <div className="h-9 w-3/4 bg-rule rounded animate-pulse" />
          <div className="h-6 w-24 bg-rule rounded animate-pulse" />
          <div className="h-12 w-full bg-rule rounded animate-pulse mt-6" />
          <div className="h-12 w-full bg-rule rounded animate-pulse mt-2" />
          <div className="h-4 w-full bg-rule rounded animate-pulse mt-8" />
          <div className="h-4 w-full bg-rule rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-rule rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
