export default function Spinner({ className = 'h-8 w-8' }) {
  return (
    <div className={`animate-spin rounded-full border-3 border-gray-200 border-t-primary-600 ${className}`}
      style={{ borderWidth: 3 }} />
  )
}

export function PageSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <Spinner className="h-10 w-10" />
    </div>
  )
}
