import { X, Copy, Facebook, Twitter, Phone } from 'lucide-react';

interface ReviewShareModalProps {
  showShare: boolean;
  setShowShare: (show: boolean) => void;
  shareUrl: string;
  handleCopy: () => void;
  copied: boolean;
}

export default function ReviewShareModal({ showShare, setShowShare, shareUrl, handleCopy, copied }: ReviewShareModalProps) {
  if (!showShare) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-primary/20">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-primary transition-colors"
          onClick={() => setShowShare(false)}
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Modal Content */}
        <h3 className="text-xl font-semibold text-primary text-center mb-4">
          Share This Review
        </h3>
        {/* Share Link Input */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={shareUrl}
            readOnly
            onFocus={(e) => e.target.select()}
            className="flex-1 text-sm px-3 py-2 border border-primary/30 rounded-full bg-gray-50"
          />
          <button
            onClick={handleCopy}
            className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            aria-label="Copy link"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        {copied && (
          <p className="text-xs text-green-600 text-center mb-2">
            Link copied!
          </p>
        )}
        {/* Social Share Icons */}
        <div className="flex justify-center gap-4 mt-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-green-500/10 hover:bg-green-500/20 transition"
            aria-label="Share on WhatsApp"
          >
            <Phone className="text-green-600 w-5 h-5" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition"
            aria-label="Share on Facebook"
          >
            <Facebook className="text-blue-600 w-5 h-5" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-sky-500/10 hover:bg-sky-500/20 transition"
            aria-label="Share on Twitter"
          >
            <Twitter className="text-sky-500 w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
} 