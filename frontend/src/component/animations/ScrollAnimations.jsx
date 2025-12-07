import { motion } from 'framer-motion';

// Fade in from bottom with scroll trigger
export const FadeInUp = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay }}
    >
        {children}
    </motion.div>
);

// Fade in from left
export const FadeInLeft = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay }}
    >
        {children}
    </motion.div>
);

// Fade in from right
export const FadeInRight = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay }}
    >
        {children}
    </motion.div>
);

// Scale in with scroll
export const ScaleIn = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay }}
    >
        {children}
    </motion.div>
);

// Stagger children animation
export const StaggerContainer = ({ children, staggerDelay = 0.1 }) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
            visible: {
                transition: {
                    staggerChildren: staggerDelay
                }
            }
        }}
    >
        {children}
    </motion.div>
);

export const StaggerItem = ({ children }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
        }}
    >
        {children}
    </motion.div>
);

// Hover scale effect
export const HoverScale = ({ children, scale = 1.05 }) => (
    <motion.div
        whileHover={{ scale }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
    >
        {children}
    </motion.div>
);

// Floating animation
export const Float = ({ children, duration = 3, delay = 0 }) => (
    <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
        {children}
    </motion.div>
);
