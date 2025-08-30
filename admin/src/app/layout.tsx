"use client";
import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { loginBack } from '@/hooks/auth';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setUser, setToken } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    handleLoginBack();
  }, []);

  const handleLoginBack = async () => {
    try {
      const res = await loginBack();
      if (!res) {
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
        router.push("/signin");
        return;
      }
      setUser(res?.user);

      if (res?.token) {
        setToken(res.token);
      }    
    } catch (error: any) {
      setToken("");
      setUser(null);
      localStorage.removeItem("token");
      router.push("/signin");
      console.error("Error during login back:", error);
    }
  };
  return (
    <html lang="en">
      <head>
        <title>GDG Admin</title>
        <meta name="description" content="GDG Admin Panel" />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: '',
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
