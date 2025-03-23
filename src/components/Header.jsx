import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-teal-900 to-teal-800 py-6 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Professional Search
            </h1>
            <p className="text-teal-100 mt-2">
              Find and connect with the right professionals for your needs
            </p>
          </div>

          <div className="flex-shrink-0">
            <img
              src="/logo-e1605087282821.png"
              alt="Rocket4Sales Logo"
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 