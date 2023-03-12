import type { FC, PropsWithChildren } from 'react';

interface LayoutProps extends PropsWithChildren {}

const Layout: FC<LayoutProps> = ({ children }) => {
  return <main className="flex min-h-screen w-full flex-col items-center justify-between sm:pt-0">{children}</main>;
};

export default Layout;
