import { Link } from '@inertiajs/react'

export default ({
    type = 'submit',
    className = '',
    processing,
    children,
    href,
    target,
    external,
    variant = 'primary',
    size = 'base',
    iconOnly,
    squared = false,
    pill = false,
    srText,
    onClick,
    disabled,
}) => {
    const baseClasses = `inline-flex items-center transition-colors font-bold text-center select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none`

    let variantClasses = ``

    switch (variant) {
        case 'secondary':
            variantClasses = `bg-transparent text-primary-500 font-bold border border-primary-500 hover:bg-neutral-25 disabled:bg-neutral-800 disabled:text-neutral-700`
            break
        case 'gray':
            variantClasses = `bg-neutral-800 text-white hover:bg-neutral-700 disabled:bg-neutral-800 disabled:text-neutral-700`
            break
        case 'black':
            variantClasses = `bg-black text-white hover:bg-neutral-800 disabled:text-neutral-500`
            break
        case 'white':
            variantClasses = `bg-white text-neutral-900 border border-neutral-200 shadow-input hover:bg-neutral-100 disabled:text-neutral-200 disabled:bg-white`
            break
        case 'green':
            variantClasses = `bg-success-500 text-white hover:border hover:border-success-500 hover:text-success-500 hover:bg-black disabled:text-success-400 disabled:border-0 disabled:bg-success-500`
            break
        case 'red':
            variantClasses = `bg-red-500 text-white hover:border hover:border-red-500 hover:text-red-500 hover:bg-black disabled:text-red-400 disabled:border-0 disabled:bg-red-500`
            break
        case 'textOnly':
            variantClasses = `bg-transparent text-primary-500 hover:text-primary-500 hover:bg-primary-100 disabled:text-neutral-700 disabled:bg-transparent`
            break
        case 'redOutline':
                variantClasses = `bg-transparent border border-error-500 text-error-500 disabled:text-neutral-700 disabled:bg-transparent`
                break
        default:
            variantClasses = `bg-vulcan-800 text-vulcan-25 shadow-button hover:bg-vulcan-800 hover:text-vulcan-200 disabled:text-white disabled:bg-vulcan-400 rounded-sm`
    }

    const sizeClasses = `${
        size == 'sm' ? (iconOnly ? 'p-1.5' : 'px-3 py-2 text-xs font-medium') : ''
    } ${
        size == 'md' ? (iconOnly ? 'p-3' : 'px-4 py-3 text-sm font-medium') : ''
    } ${
        size == 'lg' ? (iconOnly ? 'p-2' : 'px-6 py-4 text-sm font-medium') : ''
    }`

    const roundedClasses = `${!squared && !pill ? 'rounded-sm' : ''} ${
        pill ? 'rounded-full' : ''
    }`

    const iconSizeClasses = `${size == 'sm' ? 'w-5 h-5' : ''} ${
        size == 'base' ? 'w-6 h-6' : ''
    } ${size == 'lg' ? 'w-7 h-7' : ''}`

    if (href) {
        const Tag = external ? 'a' : Link

        return (
            <Tag
                target={target}
                href={href}
                className={`${baseClasses} ${sizeClasses} ${variantClasses} ${roundedClasses} ${className} ${
                    processing ? 'pointer-events-none opacity-50' : ''
                }`}
                disabled={disabled}
            >
                {children}
                {iconOnly && <span className="sr-only">{srText ?? ''}</span>}
            </Tag>
        )
    }

    return (
        <button
            type={type}
            className={`${baseClasses} ${sizeClasses} ${variantClasses} ${roundedClasses} ${className}`}
            disabled={processing || disabled}
            onClick={onClick}
        >
            {children}
            {iconOnly && <span className="sr-only">{srText ?? ''}</span>}
        </button>
    )
}