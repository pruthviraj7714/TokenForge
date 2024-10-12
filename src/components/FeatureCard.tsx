import Link from "next/link";

export default function FeatureCard({
  title,
  Icon,
  href,
  description,
  featureColor,
}: {
  title: string;
  Icon: React.ElementType;
  href: string;
  description: string;
  featureColor : string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center w-72 h-72 p-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:from-purple-700 hover:to-purple-900"
    >
      <div className={`mb-4 ${featureColor} transition-transform duration-300 ease-in-out group-hover:scale-110`}>
        <Icon size={48} />
      </div>
      <h3 className={`text-xl ${featureColor} font-bold text-center transition-colors duration-300 ease-in-out`}>
        {title}
      </h3>
      <span className="font-serif text-lg mx-auto my-2 text-white/70 italic tracking-wide shadow-sm">
        {description}
      </span>
      <div className="mt-4 w-12 h-1 bg-purple-400 rounded transition-all duration-300 ease-in-out group-hover:w-16 group-hover:bg-purple-300" />
    </Link>
  );
}
