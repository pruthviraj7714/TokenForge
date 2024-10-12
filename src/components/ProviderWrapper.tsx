"use client"

import { useState } from "react";
import Appbar from "./Appbar";
import Providers from "./Providers";

export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
    const [endpoint, setEndpoint] = useState("https://api.devnet.solana.com");

    const handleEndpointChange = (newEndpoint: string) => {
        setEndpoint(newEndpoint);
      };

  return (
    <Providers endpoint={endpoint}>
      <Appbar onEndpointChange={handleEndpointChange} />
      {children}
    </Providers>
  );
}
