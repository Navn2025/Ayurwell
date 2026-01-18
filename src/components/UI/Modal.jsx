import React, {useEffect} from "react";

// ══════════════════════════════════════════════════════════════════
// 🎯 MODAL COMPONENT - Premium modal wrapper with perfect UX
// ══════════════════════════════════════════════════════════════════

const Modal=({
    isOpen,
    onClose,
    title,
    children,
    size="md",
    showCloseButton=true,
    closeOnOverlayClick=true,
}) =>
{
    // Prevent body scroll when modal is open
    useEffect(() =>
    {
        if (isOpen)
        {
            const originalOverflow=document.body.style.overflow;
            const originalPosition=document.body.style.position;
            const originalTop=window.scrollY;
            document.body.style.overflow="hidden";
            document.body.style.position="fixed";
            document.body.style.top=`-${originalTop}px`;
            document.body.style.width="100%";
            document.body.classList.add("modal-open");
            return () =>
            {
                document.body.style.overflow=originalOverflow;
                document.body.style.position=originalPosition;
                document.body.style.top="";
                document.body.style.width="";
                document.body.classList.remove("modal-open");
                window.scrollTo(0, originalTop);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses={
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-3xl",
        xl: "max-w-5xl",
        full: "max-w-7xl mx-4",
    };

    const handleOverlayClick=(e) =>
    {
        if (closeOnOverlayClick&&e.target===e.currentTarget)
        {
            onClose();
        }
    };

    // Prevent body scroll when modal is open


    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Background overlay */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-md"
                onClick={handleOverlayClick}
            />

            {/* Modal panel */}
            <div
                className={`relative w-full ${sizeClasses[size]} bg-white shadow-2xl rounded-2xl z-[10000] max-h-[85vh] overflow-hidden flex flex-col`}
            >
                {/* Header */}
                {(title||showCloseButton)&&(
                    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1a472a]/5 to-[#2d5a3d]/5 border-b">
                        {title&&(
                            <h3 className="text-xl font-bold text-[#1a472a]">{title}</h3>
                        )}
                        {showCloseButton&&(
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto modal-scroll-content">
                    <div className="max-w-full">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
