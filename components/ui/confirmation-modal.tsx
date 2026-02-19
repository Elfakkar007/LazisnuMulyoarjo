'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmationContextType {
    confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function useConfirm() {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmationProvider');
    }
    return context;
}

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmationOptions>({ message: '' });
    const resolveRef = useRef<(value: boolean) => void>(() => { });

    const confirm = useCallback((options: ConfirmationOptions) => {
        setOptions(options);
        setIsOpen(true);
        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);

    const handleConfirm = () => {
        setIsOpen(false);
        resolveRef.current(true);
    };

    const handleCancel = () => {
        setIsOpen(false);
        resolveRef.current(false);
    };

    const variantStyles = {
        danger: {
            icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
            bgIcon: 'bg-red-100',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
            bgIcon: 'bg-amber-100',
            button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
        },
        info: {
            icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
            bgIcon: 'bg-blue-100',
            button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        },
    };

    const currentVariant = variantStyles[options.variant || 'danger'];

    return (
        <ConfirmationContext.Provider value={{ confirm }}>
            {children}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={handleCancel}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${currentVariant.bgIcon}`}>
                                        {currentVariant.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {options.title || 'Konfirmasi'}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                            {options.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end gap-3">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                    >
                                        {options.cancelText || 'Batal'}
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${currentVariant.button}`}
                                    >
                                        {options.confirmText || 'Ya, Lanjutkan'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ConfirmationContext.Provider>
    );
}
