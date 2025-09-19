import React from 'react';
import { Material } from '../api/materials';
import BlackShirt from '../icons/Black Shirt.png';
import RedShirt from '../icons/Red Shirt.png';
import WhiteShirt from '../icons/White Shirt.png';

interface MaterialInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
}

export function MaterialInspectionModal({ isOpen, onClose, material }: MaterialInspectionModalProps) {
  if (!isOpen || !material) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Material Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="flex items-center mb-6">
            <div className={`material-avatar w-16 h-16 rounded-lg flex items-center justify-center mr-4 ${material.color === 'white' ? 'border border-gray-200' : ''}`}>
              {/* We'll use the same image logic as in MaterialRow */}
              <img 
                src={getShirtImage(material.color)} 
                alt={`${material.color} shirt`} 
                className="w-14 h-14 object-contain" 
              />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">{material.name}</h4>
              <p className="text-sm text-gray-500">ID: {material.id}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Stock Amount</p>
                <p className="text-lg font-semibold text-gray-900">{material.quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pack Size</p>
                <p className="text-lg font-semibold text-gray-900">{material.packSize}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Color</p>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${getColorClass(material.color)}`}></div>
                <p className="text-gray-900">{capitalizeFirstLetter(material.color)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Size</p>
              <p className="text-gray-900">{material.size}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Tags</p>
              <div className="flex flex-wrap gap-2">
                {material.tags.length > 0 ? (
                  material.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {capitalizeFirstLetter(tag)}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No tags</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Created At</p>
              <p className="text-gray-900">{new Date(material.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
              <p className="text-gray-900">{new Date(material.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getColorClass(color: string) {
  switch (color.toLowerCase()) {
    case 'black':
      return 'bg-black';
    case 'white':
      return 'bg-white border border-gray-300';
    case 'red':
      return 'bg-red-600';
    default:
      return 'bg-gray-400';
  }
}

// Helper function to get the appropriate shirt image

function getShirtImage(color: string) {
  switch (color.toLowerCase()) {
    case 'black':
      return BlackShirt;
    case 'red':
      return RedShirt;
    case 'white':
      return WhiteShirt;
    default:
      return WhiteShirt;
  }
}
