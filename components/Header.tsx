'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const tools = [
    { name: 'PDF to Word', href: '/pdf-to-word' },
    { name: 'Word to PDF', href: '/word-to-pdf' },
    { name: 'PDF to JPG', href: '/pdf-to-jpg' },
    { name: 'JPG to PDF', href: '/jpg-to-pdf' },
    { name: 'Merge PDF', href: '/merge-pdf' },
    { name: 'Split PDF', href: '/split-pdf' },
    { name: 'Compress PDF', href: '/compress-pdf' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg">
                <i className="ri-file-pdf-line text-white text-lg"></i>
              </div>
              <span className="font-['Pacifico'] text-xl text-gray-900">TruePDF</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap cursor-pointer">
                <span>Tools</span>
                <i className="ri-arrow-down-s-line text-sm"></i>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap cursor-pointer">
              Pricing
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <i className={`${isDark ? 'ri-sun-line' : 'ri-moon-line'} text-gray-700`}></i>
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors mr-2 cursor-pointer"
            >
              <i className={`${isDark ? 'ri-sun-line' : 'ri-moon-line'} text-gray-700`}></i>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 cursor-pointer"
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="px-3 py-2 text-sm font-medium text-gray-900">Tools</div>
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                {tool.name}
              </Link>
            ))}
            <Link
              href="/pricing"
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}