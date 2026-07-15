export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d12] text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-purple-400">KIO</h1>
        <p className="text-lg text-gray-400">You are currently offline</p>
        <p className="text-sm text-gray-500">Please check your internet connection and try again.</p>
      </div>
    </div>
  );
}
