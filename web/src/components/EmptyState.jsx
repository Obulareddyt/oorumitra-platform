export default function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="font-semibold text-gray-500 text-lg">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  )
}
