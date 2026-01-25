export default function PrimaryButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={`
        bg-blue-600 hover:bg-blue-700 active:bg-blue-800
        text-white font-medium
        rounded-xl
        transition-all duration-200
        shadow-sm hover:shadow-md
        ${className}
      `}
    >
      {children}
    </button>
  )
}
