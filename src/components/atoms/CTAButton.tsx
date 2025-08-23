type CTAButtonProps = {
  label: string;
  onClick?: () => void;
};

export default function CTAButton({ label, onClick }: CTAButtonProps) {
  return (
    <div>
      <button
        onClick={onClick}
        className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:from-blue-500 hover:to-cyan-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transform active:scale-95"
      >
        <span className="flex items-center justify-center gap-2">
          {label}
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
