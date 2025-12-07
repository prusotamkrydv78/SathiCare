import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

const DialogContext = createContext(null);

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

const DialogComponent = ({ isOpen, onClose, options }) => {
    const {
        title,
        message,
        type = 'info',
        confirmText = 'OK',
        cancelText = 'Cancel',
        showCancel = false,
        onConfirm,
        closeOnOutsideClick = true
    } = options;

    const dialogRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent scrolling behind body
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-12 h-12 text-green-500" />;
            case 'error': return <AlertCircle className="w-12 h-12 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-12 h-12 text-amber-500" />;
            default: return <Info className="w-12 h-12 text-blue-500" />;
        }
    };

    const getTitleColor = () => {
        switch (type) {
            case 'success': return 'text-green-800';
            case 'error': return 'text-red-800';
            case 'warning': return 'text-amber-800';
            default: return 'text-gray-900';
        }
    };

    const handleBackdropClick = (e) => {
        if (closeOnOutsideClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={dialogRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 border border-gray-100"
            >
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 sm:p-8 flex flex-col items-center text-center">
                    <div className="mb-6 p-3 rounded-full bg-gray-50 border border-gray-100 shadow-sm">
                        {getIcon()}
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${getTitleColor()}`}>
                        {title || (type.charAt(0).toUpperCase() + type.slice(1))}
                    </h3>

                    <div className="text-gray-600 mb-8 leading-relaxed">
                        {typeof message === 'string' ? (
                            message.split('\n').map((line, i) => (
                                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                            ))
                        ) : message}
                    </div>

                    <div className="flex gap-3 w-full justify-center">
                        {showCancel && (
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all flex-1 max-w-[140px]"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={handleConfirm}
                            className={`px-6 py-2.5 rounded-xl text-white font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all flex-1 max-w-[140px]
                ${type === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 shadow-green-200' : ''}
                ${type === 'error' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-red-200' : ''}
                ${type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400 shadow-amber-200' : ''}
                ${type === 'info' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-blue-200' : ''}
              `}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const DialogProvider = ({ children }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogOptions, setDialogOptions] = useState({});

    const closeDialog = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const showDialog = useCallback((options) => {
        setDialogOptions(options);
        setDialogOpen(true);
    }, []);

    return (
        <DialogContext.Provider value={{ showDialog, closeDialog }}>
            {children}
            <DialogComponent
                isOpen={dialogOpen}
                onClose={closeDialog}
                options={dialogOptions}
            />
        </DialogContext.Provider>
    );
};
