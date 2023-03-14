import type { FC, PropsWithChildren } from "react";

interface LayoutProps extends PropsWithChildren {}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="flex relative items-center h-full w-full flex-col justify-center overflow-hidden sm:pt-0">
      {children}
    </main>
  );
};

export default Layout;
