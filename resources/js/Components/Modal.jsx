import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { useCallback } from 'react';

export default function Modal({
    header,
    children,
    footer,
    show = false,
    maxWidth = 'md', 
    maxHeight = 'md',
    closeable = true,
    onClose = () => {},
    preventCloseOnClickOutside = true,
    
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'min-w-[300px] max-w-[400px] lg:min-w-[360px] lg:max-w-[480px] xl:min-w-[400px] xl:max-w-[600px]',
        md: 'min-w-[450px] max-w-[600px] lg:min-w-[500px] lg:max-w-[720px] xl:min-w-[600px] xl:max-w-[800px]',
        lg: 'min-w-[600px] max-w-[720px] lg:min-w-[720px] lg:max-w-[800px] xl:min-w-[800px] xl:max-w-[960px]',
    }[maxWidth];

    const maxHeightClass = {
        sm: 'min-h-[70vh] max-h-[85vh] lg:min-h-[60vh] lg:max-h-[80vh] xl:min-h-[60vh] xl:max-h-[80vh]',
        md: 'min-h-[75vh] max-h-[90vh] lg:min-h-[70vh] lg:max-h-[80vh] xl:min-h-[70vh] xl:max-h-[80vh]',
        lg: 'min-h-[75vh] max-h-[90vh] lg:min-h-[70vh] lg:max-h-[85vh] xl:min-h-[70vh] xl:max-h-[80vh]',
        // xl: 'sm:h-full max-h-screen md:h-full lg:min-h-auto xl:min-h-[700px]',
    }[maxHeight];

    const handleOverlayClick = useCallback((e) => {
        if (preventCloseOnClickOutside) {
            e.stopPropagation();
        } else {
            close(); // Close if not preventing
        }
    }, [preventCloseOnClickOutside, close]);

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex transform justify-center items-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
                onClose={preventCloseOnClickOutside ? () => {} : close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75" onClick={handleOverlayClick} />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={`transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full ${maxWidthClass} `}
                    >
                        <div className='flex p-5 text-lg font-Lora font-bold'>
                            {header}
                        </div>
                        <div className='py-3 px-4 flex w-full'>
                            {children}
                        </div>
                        <div className={`"w-full p-4 bg-white rounded-b-lg shadow-modal" `}>
                            {footer}
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
