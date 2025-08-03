
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const conversionTools = [
    {
      title: 'PDF to Word',
      description: 'Convert PDF files to editable Word documents',
      icon: 'ri-file-word-line',
      href: '/pdf-to-word',
      gradient: 'from-blue-500 to-indigo-600',
      bgPattern: 'bg-blue-50'
    },
    {
      title: 'Word to PDF',
      description: 'Transform Word documents into PDF format',
      icon: 'ri-file-pdf-line',
      href: '/word-to-pdf',
      gradient: 'from-green-500 to-emerald-600',
      bgPattern: 'bg-green-50'
    },
    {
      title: 'PDF to JPG',
      description: 'Extract images from PDF pages',
      icon: 'ri-image-line',
      href: '/pdf-to-jpg',
      gradient: 'from-purple-500 to-violet-600',
      bgPattern: 'bg-purple-50'
    },
    {
      title: 'JPG to PDF',
      description: 'Convert images to PDF documents',
      icon: 'ri-file-image-line',
      href: '/jpg-to-pdf',
      gradient: 'from-orange-500 to-red-600',
      bgPattern: 'bg-orange-50'
    },
    {
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into one',
      icon: 'ri-file-copy-2-line',
      href: '/merge-pdf',
      gradient: 'from-pink-500 to-rose-600',
      bgPattern: 'bg-pink-50'
    },
    {
      title: 'Split PDF',
      description: 'Extract pages from PDF documents',
      icon: 'ri-scissors-cut-line',
      href: '/split-pdf',
      gradient: 'from-teal-500 to-cyan-600',
      bgPattern: 'bg-teal-50'
    },
    {
      title: 'Compress PDF',
      description: 'Reduce PDF file size efficiently',
      icon: 'ri-compress-line',
      href: '/compress-pdf',
      gradient: 'from-indigo-500 to-blue-600',
      bgPattern: 'bg-indigo-50'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20smiling%20portrait%20headshot%20clean%20white%20background%20modern%20office%20style&width=80&height=80&seq=avatar1&orientation=squarish',
      content: 'This PDF converter has streamlined our document workflow. The quality is exceptional and it saves us hours every week.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Legal Consultant',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20confident%20smile%20portrait%20headshot%20clean%20white%20background%20modern%20office%20style&width=80&height=80&seq=avatar2&orientation=squarish',
      content: 'Perfect for converting contracts and legal documents. The formatting stays intact every time.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Freelance Designer',
      avatar: 'https://readdy.ai/api/search-image?query=creative%20professional%20woman%20friendly%20smile%20portrait%20headshot%20clean%20white%20background%20artistic%20modern%20style&width=80&height=80&seq=avatar3&orientation=squarish',
      content: 'Love how easy it is to merge portfolio PDFs. The interface is intuitive and the results are always high-quality.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      {/* Compact Hero Section with Tools Focus */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Professional PDF Tools
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Convert, merge, split, and compress your documents with lightning speed. 
              Professional-grade tools for modern workflows.
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">2M+</div>
                <div className="text-blue-100 text-sm">Files Converted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-blue-100 text-sm">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">2s</div>
                <div className="text-blue-100 text-sm">Average Speed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tools Section - Immediately Visible */}
      <section id="tools" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
              <i className="ri-tools-line mr-2"></i>
              Choose Your Tool
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Convert Any Document
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                In Seconds
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Select the conversion tool you need. All tools are fast, secure, and maintain perfect quality.
            </p>
          </div>

          {/* Featured Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {conversionTools.map((tool, index) => (
              <div
                key={tool.title}
                className={`group transform transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={tool.href} className="block">
                  <div className={`relative h-80 ${tool.bgPattern} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-white/80 hover:border-white`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-24 h-24 border-2 border-current rounded-full"></div>
                      <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-current rounded-full"></div>
                    </div>
                    
                    {/* Icon with Gradient */}
                    <div className={`relative z-10 w-20 h-20 bg-gradient-to-r ${tool.gradient} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl`}>
                      <i className={`${tool.icon} text-3xl text-white`}></i>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-8">
                        {tool.description}
                      </p>
                      
                      {/* Action Button */}
                      <div className="flex items-center text-base font-semibold">
                        <span className={`bg-gradient-to-r ${tool.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                          Start Converting
                        </span>
                        <i className="ri-arrow-right-line ml-3 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-2 transition-all"></i>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r ${tool.gradient} transition-opacity duration-300 rounded-3xl`}></div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
                  <i className="ri-shield-check-line text-green-600 text-2xl"></i>
                </div>
                <div className="text-lg font-bold text-gray-900">100% Secure</div>
                <div className="text-sm text-gray-600">SSL Encrypted</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-4">
                  <i className="ri-time-line text-blue-600 text-2xl"></i>
                </div>
                <div className="text-lg font-bold text-gray-900">Lightning Fast</div>
                <div className="text-sm text-gray-600">2 Second Average</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
                  <i className="ri-award-line text-purple-600 text-2xl"></i>
                </div>
                <div className="text-lg font-bold text-gray-900">Premium Quality</div>
                <div className="text-sm text-gray-600">Pixel Perfect</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center bg-pink-100 rounded-full mb-4">
                  <i className="ri-delete-bin-line text-pink-600 text-2xl"></i>
                </div>
                <div className="text-lg font-bold text-gray-900">Auto-Delete</div>
                <div className="text-sm text-gray-600">Files Removed 24h</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for professionals who demand speed, security, and exceptional quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <i className="ri-shield-check-line text-4xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bank-Level Security</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Your files are encrypted and automatically deleted after 24 hours. 
                We never store or access your documents.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <i className="ri-rocket-line text-4xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Advanced processing engines deliver results in seconds, not minutes. 
                Perfect for busy professionals and tight deadlines.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <i className="ri-award-line text-4xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Industry-leading conversion algorithms preserve formatting, fonts, 
                and layout with pixel-perfect accuracy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover object-top mr-4 ring-4 ring-blue-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <div className="flex mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join millions of professionals who trust our platform for their document conversion needs
          </p>
          <Link
            href="#tools"
            className="inline-flex items-center bg-white text-gray-900 px-12 py-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            Get Started Now
            <i className="ri-arrow-right-line ml-3"></i>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
