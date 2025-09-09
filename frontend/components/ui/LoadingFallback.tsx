// components/ui/LoadingFallback.tsx
import LoadingSpinner from "./LoadingSpinner";

export default function LoadingFallback() {
    return (
        <div className="flex items-center justify-center h-40">
            <LoadingSpinner size={60} />
        </div>
    );
}
