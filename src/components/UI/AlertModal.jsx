import React from 'react';
import Modal from './Modal';

const AlertModal=({
    isOpen,
    onClose,
    type='info',
    title,
    message,
    confirmText='OK',
    showConfirmButton=true,
    autoClose=false,
    autoCloseDelay=3000
}) =>
{

    React.useEffect(() =>
    {
        if (autoClose&&isOpen)
        {
            const timer=setTimeout(onClose, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [autoClose, autoCloseDelay, isOpen, onClose]);

    const getAlertStyles=(type) =>
    {
        const styles={
            success: {
                icon: (
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                ),
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                titleColor: 'text-green-800',
                messageColor: 'text-green-700',
                buttonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            },
            error: {
                icon: (
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ),
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                titleColor: 'text-red-800',
                messageColor: 'text-red-700',
                buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            },
            warning: {
                icon: (
                    <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            d="M12 9v4m0 4h.01M10.29 3.86l-7.4 12.8A1 1 0 003.74 18h16.52a1 1 0 00.86-1.5l-7.4-12.8a1 1 0 00-1.72 0z" />
                    </svg>
                ),
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                titleColor: 'text-yellow-800',
                messageColor: 'text-yellow-700',
                buttonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
            },
            info: {
                icon: (
                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                ),
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                titleColor: 'text-blue-800',
                messageColor: 'text-blue-700',
                buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }
        };
        return styles[type]||styles.info;
    };

    const styles=getAlertStyles(type);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            closeOnOverlayClick={!autoClose}
        >
            <div className={`p-4 sm:p-5 rounded-lg ${styles.bgColor} ${styles.borderColor} border`}>
                <div className="flex gap-3">
                    <div className="flex-shrink-0">
                        {styles.icon}
                    </div>
                    <div className="flex-1">
                        {title&&(
                            <h3 className={`text-sm sm:text-base font-medium ${styles.titleColor}`}>
                                {title}
                            </h3>
                        )}
                        {message&&(
                            <p className={`mt-2 text-sm ${styles.messageColor}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                {showConfirmButton&&(
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 text-white text-sm font-medium rounded-md ${styles.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
                        >
                            {confirmText}
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AlertModal;
