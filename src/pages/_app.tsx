import { type AppType } from "next/dist/shared/lib/utils";
import { Inter as FontSans } from "next/font/google";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";

import "../styles/globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>{`
				:root {
					--font-sans: ${fontSans.style.fontFamily};
				}
			}`}</style>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <title>Chat Baker</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <Component {...pageProps} />
        <Analytics />
      </ThemeProvider>
    </>
  );
};

export default MyApp;
