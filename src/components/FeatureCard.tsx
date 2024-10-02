import { IconNode, LucideProps } from "lucide-react";
import Link from "next/link";


export default function FeatureCard( {title, Icon, href} : {title : string, Icon : any, href : string}) {
    return (
        <Link href={href} className="flex items-center justify-center border  shadow-xl bg-purple-800 hover:bg-purple-900 text-white gap-1.5 p-3 w-[230px] h-[200px] border-black/35 cursor-pointer">
            <div className="text-lg font-semibold">{title}</div>
            <div>
               <Icon size={30} />
            </div>
        </Link>
    )
}