import { RefreshCw } from "lucide-react";

export default function ErrorState({ error, handleRetry }: { error: string; handleRetry: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
    return (
      <div className="text-center py-10">
        <p className="text-secondary mb-2">{error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-white rounded-md inline-flex items-center"
        >
          <RefreshCw size={16} className="mr-2" /> Try Again
        </button>
      </div>
    );
  }
  