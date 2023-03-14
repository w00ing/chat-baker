import { Head, Html, Main, NextScript } from "next/document";
import { cn } from "@/libs/cn";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/logo.svg" />
        <meta name="description" content="Bake a chatbot with any url!" />
        <meta property="og:site_name" content="chat-baker.com" />
        <meta
          property="og:description"
          content="Bake a chatbot with any url!"
        />
        <meta property="og:title" content="Chat Baker" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chat Baker" />
        <meta
          name="twitter:description"
          content="Bake a chatbot with any url!"
        />
        <meta
          property="og:image"
          content="https://ideagenerator-xyz.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://ideagenerator-xyz.vercel.app/og-image.png"
        />
      </Head>
      <body
        className={cn(
          "bg-white font-sans text-slate-900 antialiased dark:bg-slate-800 dark:text-slate-50"
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
