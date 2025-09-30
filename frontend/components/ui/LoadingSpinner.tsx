export default function LoadingSpinner({ size = 40 }: { size?: number }) {
    return (
        <div
            className="flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            <div
                className="animate-spin rounded-full border-4 border-gray-200 border-t-orange-600"
                style={{
                    width: size,
                    height: size,
                    borderWidth: size * 0.1,
                }}
            />
        </div>
    );
}
