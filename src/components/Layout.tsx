import type { FC, PropsWithChildren } from "react";

interface LayoutProps extends PropsWithChildren {}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="flex bg-gray-800 h-screen w-full flex-col items-center justify-between sm:pt-0">
      {children}
    </main>
  );
};

export default Layout;
