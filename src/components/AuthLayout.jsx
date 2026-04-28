import { motion } from "framer-motion";

export default function AuthLayout({ children, title, subtitle, image }) {
  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-[#fffdf9] p-4 md:p-8">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white shadow-2xl shadow-stone-200/50">
        {/* Left Side - Visual */}
        <div className="relative hidden w-1/2 overflow-hidden bg-stone-100 lg:block">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={image || "/src/assets/hero-banner.png"}
            className="h-full w-full object-cover object-center"
            alt="Auth visual"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl font-bold leading-tight"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-4 text-lg text-stone-200"
            >
              {subtitle}
            </motion.p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full p-8 md:p-12 lg:w-1/2">
          <div className="mx-auto max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
