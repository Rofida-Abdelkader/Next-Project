'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}):  React.JSX.Element {
  const pathname: string = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAuth = (): void => {
      const hasToken: boolean = document.cookie.includes('token=');
      setIsLoggedIn(hasToken);
    };
    checkAuth();
  }, [pathname]);
  
  const handleLogout = async (): Promise<void> => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };
  
  const hideNavbar: boolean = pathname === '/login';
  
  return (
    <html lang="en">
      <body>
        {!hideNavbar && isLoggedIn && (
          <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex space-x-6">
                <a href="/dashboard" className="hover:text-gray-300">Dashboard</a>
                <a href="/products" className="hover:text-gray-300">Products</a>
                <a href="/categories" className="hover:text-gray-300">Categories</a>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </nav>
        )}
        <main>{children}</main>
      </body>
    </html>
  );
}