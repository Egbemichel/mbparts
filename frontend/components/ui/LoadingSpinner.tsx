import { motion } from "framer-motion";

export default function LoadingSpinner({ size = 40 }: { size?: number }) {
    return (
        <motion.div
            className="flex items-center justify-center"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
            }}
            style={{
                width: size,
                height: size,
                border: `${size * 0.1}px solid #e5e7eb`, // gray-200
                borderTop: `${size * 0.1}px solid #fe7232`, // orange-600
                borderRadius: "50%",
            }}
        />
    );
}
