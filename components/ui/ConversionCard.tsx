import Link from 'next/link';

interface ConversionCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  fromFormat: string;
  toFormat: string;
  color: string;
}

export default function ConversionCard({ 
  title, 
  description, 
  icon, 
  href, 
  fromFormat, 
  toFormat, 
  color 
}: ConversionCardProps) {
  return (
    <Link href={href} className="group cursor-pointer">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 group-hover:border-blue-200">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${color} flex-shrink-0`}>
            <i className={`${icon} text-white text-xl`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {description}
            </p>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {fromFormat}
              </span>
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-right-line text-gray-400 text-sm"></i>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {toFormat}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}