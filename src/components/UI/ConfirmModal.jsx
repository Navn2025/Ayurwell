import React from 'react';
import Modal from './Modal';

const ConfirmModal=({
    isOpen,
    onClose,
    onConfirm,
    title='Confirm Action',
    message='Are you sure you want to proceed?',
    confirmText='Confirm',
    cancelText='Cancel',
    type='danger',
    loading=false
}) =>
{

    const getConfirmStyles=(type) =>
    {
        const styles={
            danger: {
                icon: (
                    <svg className="w-6 h-6" fill="#ff0000" viewBox="0 0 640 640">
                        <path d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z" />
                    </svg>
                ),
                bg: 'bg-red-100',
                titleColor: 'text-red-900',
                messageColor: 'text-red-700',
                confirmButtonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                cancelButtonColor: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            },
            warning: {
                icon: (
                    <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            d="M12 9v4m0 4h.01M10.29 3.86l-7.4 12.8A1 1 0 003.74 18h16.52a1 1 0 00.86-1.5l-7.4-12.8a1 1 0 00-1.72 0z" />
                    </svg>
                ),
                bg: 'bg-yellow-100',
                titleColor: 'text-yellow-900',
                messageColor: 'text-yellow-700',
                confirmButtonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
                cancelButtonColor: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            },
            info: {
                icon: (
                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                ),
                bg: 'bg-blue-100',
                titleColor: 'text-blue-900',
                messageColor: 'text-blue-700',
                confirmButtonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                cancelButtonColor: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }
        };
        return styles[type]||styles.danger;
    };

    const styles=getConfirmStyles(type);

    const handleConfirm=() =>
    {
        if (!loading) onConfirm();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="text-center px-4 py-2 sm:py-4 sm:px-6">
                <div className={`mx-auto flex mt-2 items-center justify-center h-12 w-12 rounded-full ${styles.bg}`}>
                    {styles.icon}
                </div>

                <div className="mt-4">
                    <h3 className={`text-base sm:text-lg font-medium ${styles.titleColor}`}>
                        {title}
                    </h3>
                    <p className={`mt-2 text-sm sm:text-base ${styles.messageColor}`}>
                        {message}
                    </p>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md ${styles.cancelButtonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-md ${styles.confirmButtonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                        {loading&&(
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                            </svg>
                        )}
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
