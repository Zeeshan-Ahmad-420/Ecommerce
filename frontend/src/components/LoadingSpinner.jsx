const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-black">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-20 blur-3xl animate-ping" />
        <div className="w-full h-full rounded-full border-4 border-emerald-300/20 shadow-inner shadow-emerald-500/10" />
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-emerald-500 animate-spin" />
        <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-500/60 transform -translate-x-1/2 -translate-y-1/2" />

        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
