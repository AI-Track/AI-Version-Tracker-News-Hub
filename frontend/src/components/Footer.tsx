const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">关于我们</h3>
            <p className="text-gray-600">
              AI Version Tracker & News Hub 致力于为开发者提供最新的 AI 产品更新和新闻资讯。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <a href="/versions" className="text-gray-600 hover:text-primary-600">
                  版本更新
                </a>
              </li>
              <li>
                <a href="/news" className="text-gray-600 hover:text-primary-600">
                  新闻动态
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-600 hover:text-primary-600">
                  产品追踪
                </a>
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
          <p>&copy; {new Date().getFullYear()} AI Version Tracker & News Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 