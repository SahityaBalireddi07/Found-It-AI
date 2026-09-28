import React, { useState } from 'react';
import { ItemCategory, ItemType } from '../types';
import { 
  Headphones, 
  CreditCard, 
  Key, 
  Briefcase, 
  Shirt, 
  BookOpen, 
  Coffee, 
  Watch, 
  HelpCircle 
} from 'lucide-react';

interface ImageFallbackProps {
  imageUrl?: string;
  category: ItemCategory;
  type: ItemType;
  name: string;
  className?: string;
}

export const getCategoryIcon = (category: ItemCategory, className = 'w-6 h-6') => {
  switch (category) {
    case 'Electronics':
      return <Headphones className={className} />;
    case 'IDs & Cards':
      return <CreditCard className={className} />;
    case 'Keys':
      return <Key className={className} />;
    case 'Bags & Backpacks':
      return <Briefcase className={className} />;
    case 'Clothing & Wearables':
      return <Shirt className={className} />;
    case 'Books & Supplies':
      return <BookOpen className={className} />;
    case 'Bottles & Tumblers':
      return <Coffee className={className} />;
    case 'Jewelry & Accessories':
      return <Watch className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

export const ImageFallback: React.FC<ImageFallbackProps> = ({
  imageUrl,
  category,
  type,
  name,
  className = 'w-full h-48',
}) => {
  const [hasError, setHasError] = useState(false);

  // If valid image provided and no error
  if (imageUrl && !hasError) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
        <img
          src={imageUrl}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Domain styled CSS/SVG fallback container matching clean campus aesthetic
  const isLost = type === 'lost';
  const bgStyle = isLost 
    ? 'bg-gradient-to-br from-amber-50 via-slate-100 to-sky-50' 
    : 'bg-gradient-to-br from-blue-50 via-slate-100 to-indigo-50';

  const iconColor = isLost ? 'text-amber-600' : 'text-blue-600';
  const iconBg = isLost ? 'bg-amber-100/70 border-amber-200' : 'bg-blue-100/70 border-blue-200';

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden border-b border-slate-100 ${bgStyle} ${className}`}
    >
      {/* Decorative ambient subtle circle */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/40 blur-xl pointer-events-none" />
      
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center border shadow-xs mb-2 transition-transform group-hover:scale-105 duration-200 ${iconBg} ${iconColor}`}
      >
        {getCategoryIcon(category, 'w-7 h-7')}
      </div>
      
      <p className="text-xs font-semibold text-slate-700 tracking-tight line-clamp-1 max-w-[85%]">
        {category}
      </p>
      <span className="text-[11px] text-slate-400 mt-0.5">
        Photo not provided · Verified description
      </span>
    </div>
  );
};
