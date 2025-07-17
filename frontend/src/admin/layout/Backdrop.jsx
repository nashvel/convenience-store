import React from 'react';
import { useSidebar } from "../context/SidebarContext";
import { motion, AnimatePresence } from 'framer-motion';

const Backdrop = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </AnimatePresence>
  );
};

export default Backdrop;
