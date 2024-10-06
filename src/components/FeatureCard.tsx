import Link from "next/link"

export default function FeatureCard({
  title,
  Icon,
  href,
}: {
  title: string
  Icon: React.ElementType
  href: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center w-64 h-64 p-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:from-purple-700 hover:to-purple-900"
    >
      <div className="mb-4 text-purple-200 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:text-white">
        <Icon size={48} />
      </div>
      <h3 className="text-xl font-bold text-white text-center transition-colors duration-300 ease-in-out group-hover:text-purple-100">
        {title}
      </h3>
      <div className="mt-4 w-12 h-1 bg-purple-400 rounded transition-all duration-300 ease-in-out group-hover:w-16 group-hover:bg-purple-300" />
    </Link>
  )
}