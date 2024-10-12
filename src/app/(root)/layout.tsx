import ProviderWrapper from "@/components/ProviderWrapper";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ProviderWrapper>
        {children}
      </ProviderWrapper>
    </div>
  );
}
