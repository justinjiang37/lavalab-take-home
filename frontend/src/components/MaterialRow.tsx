import React from 'react';
import { Material } from '../api/materials';
import BlackShirt from '../icons/Black Shirt.png';
import RedShirt from '../icons/Red Shirt.png';
import WhiteShirt from '../icons/White Shirt.png';

interface MaterialRowProps {
  product: Material; // Keeping param name as 'product' for now to minimize changes
  onQuantityUpdate: (materialId: number, newQuantity: number) => void;
  onInspect?: (material: Material) => void; // Optional callback for inspection
}

export function MaterialRow({ product, onQuantityUpdate, onInspect }: MaterialRowProps) {
  const handleChange = (delta: number) => {
    const next = Math.max(0, product.quantity + delta);
    if (next !== product.quantity) {
      onQuantityUpdate(product.id, next);
    }
  };
  
  // Get the appropriate shirt image based on color
  const getShirtImage = (color: string) => {
    switch (color.toLowerCase()) {
      case 'black':
        return BlackShirt;
      case 'red':
        return RedShirt;
      case 'white':
        return WhiteShirt;
      default:
        // Default to white shirt if color doesn't match
        return WhiteShirt;
    }
  };
  
  // Handle click on material row for inspection
  const handleInspect = () => {
    if (onInspect) {
      onInspect(product);
    }
  };

  return (
    <div 
      className="material-row grid grid-cols-[auto_1fr_auto] gap-3 items-center px-4 py-2 first:pt-2 last:pb-2 border-t first:border-t-0 border-gray-100 hover:bg-gray-50 cursor-pointer"
      onClick={handleInspect}
    >
      <div 
        className={`material-avatar w-9 h-9 rounded-lg flex items-center justify-center ${product.color === 'white' ? 'border border-gray-200' : ''}`}
        onClick={(e) => e.stopPropagation()} // Prevent triggering inspection when clicking on avatar
      >
        <img 
          src={getShirtImage(product.color)} 
          alt={`${product.color} shirt`} 
          className="w-8 h-8 object-contain" 
        />
      </div>
      <div className="material-name text-sm text-gray-800">
        {product.name}
      </div>
      <div 
        className="material-stepper flex items-center gap-2"
        onClick={(e) => e.stopPropagation()} // Prevent triggering inspection when clicking on stepper
      >
        <button
          className="stepper-btn w-7 h-7 rounded-md border border-gray-300 bg-white text-gray-500 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.stopPropagation();
            handleChange(-1);
          }}
          aria-label="decrease"
          disabled={product.quantity <= 0}
        >
          −
        </button>
        <div className={`stepper-badge min-w-16 rounded px-2 py-1 text-center ${product.quantity < product.packSize ? 'bg-amber-100' : ''}`}>
          <div className="badge-number text-lg font-bold leading-none text-stone-900">{product.quantity}</div>
          <div className={`badge-caption mt-0.5 text-[10px] uppercase tracking-wide ${product.quantity < product.packSize ? 'text-amber-700' : 'text-gray-500'}`}>{product.packSize} PCS</div>
        </div>
        <button
          className="stepper-btn w-7 h-7 rounded-md border border-gray-300 bg-white text-gray-500 font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            handleChange(1);
          }}
          aria-label="increase"
        >
          +
        </button>
      </div>
    </div>
  );
}


