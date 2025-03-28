import { Link } from '@inertiajs/react'

export default ({
    className = '',
    children,
    variant = 'primary',
    withIcon = false,
}) => {
    const baseClasses = `py-1 px-2 text-[11px] font-bold uppercase inline-flex gap-1 justify-center items-center`

    let variantClasses = ``

    switch (variant) {
        case 'error':
            variantClasses = `bg-others-red text-error-25`
            break
        case 'success':
            variantClasses = `bg-others-green text-success-25`
            break
        case 'warning':
            variantClasses = `bg-others-yellow text-warning-25`
            break
        case 'black':
            variantClasses = `bg-vulcan-700 text-vulcan-25`
            break
        case 'green':
            variantClasses = `bg-others-purple text-vulcan-25`
            break
        case 'grey':
            variantClasses = `bg-vulcan-200 text-vulcan-900`
            break
        default:
            variantClasses = `bg-others-blue text-information-25`
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses} ${className}`}
        >
            {withIcon}
            {children}
        </div>
    )
}