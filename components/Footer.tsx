import Link from 'next/link';

export default function Footer() {
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
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg">
                <i className="ri-file-pdf-line text-white text-lg"></i>
              </div>
              <span className="font-['Pacifico'] text-xl text-gray-900">TruePDF</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Convert, merge, split, and compress your PDF files with our powerful online tools. Fast, secure, and completely free.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                <i className="ri-twitter-line"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                <i className="ri-facebook-line"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                <i className="ri-instagram-line"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Tools</h3>
            <ul className="space-y-2">
              {tools.slice(0, 4).map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">More Tools</h3>
            <ul className="space-y-2">
              {tools.slice(4).map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} PDFTools. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}