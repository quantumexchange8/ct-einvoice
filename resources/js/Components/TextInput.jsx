import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput({ 
        type = 'text', 
        className = '', 
        withIcon = false,
        isFocused = false, ...props 
    },ref) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                `'flex py-3 px-4 w-full text-sm items-center self-stretch rounded-sm border border-vulcan-200 hover:border-vulcan-700 focus:border-vulcan-700 outline-none focus:outline-none focus:ring-0 text-vulcan-950 disabled:bg-vulcan-25 disabled:border-vulcan-50 disabled:text-vulcan-400 
                ${withIcon ? 'pl-11 pr-4' : ''}'` +
                className
            }
            ref={localRef}
        />
    );
});
