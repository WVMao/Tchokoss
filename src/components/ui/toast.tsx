'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'info';

type Toast = {
    id: string;
    message: string;
    type: ToastType;
};

type ToastContextType = {
    addToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className="pointer-events-auto min-w-[300px] bg-white dark:bg-gray-800 shadow-2xl rounded-xl border-l-4 border-emerald-500 overflow-hidden flex items-center p-4 gap-3"
                        >
                            <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                {toast.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
                            </div>
                            <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
