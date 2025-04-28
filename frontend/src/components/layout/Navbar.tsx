import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-primary-600">
            AI Tracker
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/versions" className="text-gray-600 hover:text-primary-600">
              版本更新
            </Link>
            <Link href="/news" className="text-gray-600 hover:text-primary-600">
              新闻动态
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-primary-600">
              产品追踪
            </Link>
          </div>

          <div className="md:hidden">
            {/* Mobile menu button will be added here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 