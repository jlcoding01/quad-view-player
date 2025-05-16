import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-400 py-3 px-4 text-center text-sm">
      <div className="container mx-auto">
        <p>
          QuadView &copy; {new Date().getFullYear()} | 
          <a 
            href="#" 
            className="text-blue-400 hover:text-blue-300 ml-1 transition-colors"
          >
            Terms
          </a>
          <span className="mx-1">|</span>
          <a 
            href="#" 
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Privacy
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;