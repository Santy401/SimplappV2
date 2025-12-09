interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'primary' | 'secondary';   
}

export const Input = ({ variant = 'primary', className, ...props }: InputProps)  => {
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    };

    return (
        <input 
            type="text"
            className={`${baseStyles} ${variants[variant]} ${className || ''}`}
            {...props}
        />
    )
}