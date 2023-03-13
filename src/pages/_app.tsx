import { type AppType } from "next/dist/shared/lib/utils";
import { Inter as FontSans } from "next/font/google";
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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default MyApp;
