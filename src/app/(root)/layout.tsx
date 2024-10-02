import Appbar from "@/components/Appbar";
import Providers from "@/components/Providers";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>
    <Providers>
      <Appbar />
       {children}
    </Providers>
    </div>;
}
