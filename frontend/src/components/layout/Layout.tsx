import { ReactNode } from 'react';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageToggle } from '../common/LanguageToggle';
import { GlobalError } from '../common/GlobalError';
import ErrorBoundary from '../common/ErrorBoundary';
import { useStore } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from '@/hooks/useTranslation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const navItems = [
    { href: '/products', label: t('layout.products') },
    { href: '/versions', label: t('layout.versions') },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold">
                {t('layout.title')}
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    router.pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        </header>


        <main className="flex-1 flex flex-col w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
          <div className="container mx-auto px-4 w-full">
            {children}
          </div>
        </main>

        <footer className="border-t py-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            {t('layout.copyright')}
          </div>
        </footer>

        <GlobalError />
      </div>
    </ErrorBoundary>
  );
};

export default Layout; 