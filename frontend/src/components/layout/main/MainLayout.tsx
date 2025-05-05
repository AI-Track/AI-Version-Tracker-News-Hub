import { ReactNode } from 'react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { GlobalError } from '@/components/common/GlobalError';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useStore } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from '@/hooks/useTranslation';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
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

        <footer className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">关于我们</h3>
                <p className="text-gray-600">
                  AI Tracker & News Hub 致力于为开发者提供最新的 AI 产品更新和新闻资讯。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">快速链接</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/versions" className="text-gray-600 hover:text-primary-600">
                      版本更新
                    </Link>
                  </li>
                  <li>
                    <Link href="/news" className="text-gray-600 hover:text-primary-600">
                      新闻动态
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="text-gray-600 hover:text-primary-600">
                      产品追踪
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">联系我们</h3>
                <p className="text-gray-600">
                  如有任何问题或建议，请通过以下方式联系我们：
                </p>
                <ul className="mt-2 space-y-2">
                  <li>
                    <a href="https://github.com/AI-Track/AI-Version-Tracker-News-Hub" className="text-gray-600 hover:text-primary-600">
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
              <p>&copy; {new Date().getFullYear()} AI Tracker & News Hub. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <GlobalError />
      </div>
    </ErrorBoundary>
  );
} 