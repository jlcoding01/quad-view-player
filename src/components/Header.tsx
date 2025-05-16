import React from 'react';
import { Grid2X2, Maximize2, Github } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Grid2X2 className="text-blue-400" size={24} />
          <h1 className="text-xl font-bold">QuadView</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <button className="flex items-center space-x-1 text-sm text-slate-300 hover:text-white transition-colors">
            <Maximize2 size={16} />
            <span>Fullscreen</span>
          </button>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <Github size={16} />
            <span>Source</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;