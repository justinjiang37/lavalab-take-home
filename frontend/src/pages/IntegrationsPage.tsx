import React, { useState } from 'react';

// Import integration logos directly
import shopifyLogo from '../icons/integrations/Shopify-Logo-PNG-HD.png';
import squareLogo from '../icons/integrations/Square,_Inc_-_Square_Logo.jpg';
import quickbooksLogo from '../icons/integrations/qb-logo.webp';
import shopwareLogo from '../icons/integrations/download.png';
import klarnaLogo from '../icons/integrations/images.jpeg';

// Define integration interface
interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  isConnected: boolean;
}

export function IntegrationsPage() {
  // Sample integrations data
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Sync customers, send your customers Email & SMS campaigns and notifications.',
      logo: shopifyLogo,
      isConnected: false
    },
    {
      id: 'shopware',
      name: 'Shopware',
      description: 'Connect your Shopware store to sync products, inventory, and orders automatically.',
      logo: shopwareLogo,
      isConnected: false
    },
    {
      id: 'square',
      name: 'Square',
      description: 'Process payments, manage inventory, and track sales with Square integration.',
      logo: squareLogo,
      isConnected: false
    },
    {
      id: 'quickbooks',
      name: 'Quickbooks',
      description: 'Streamline your accounting with automatic sales and expense tracking.',
      logo: quickbooksLogo,
      isConnected: true
    },
    {
      id: 'klarna',
      name: 'Klarna',
      description: 'Offer flexible payment options to your customers with Klarna integration.',
      logo: klarnaLogo,
      isConnected: false
    }
  ]);

  // Handle integration connection toggle
  const handleToggleConnection = (id: string) => {
    setIntegrations(
      integrations.map(integration => 
        integration.id === id 
          ? { ...integration, isConnected: !integration.isConnected } 
          : integration
      )
    );
  };

  return (
    <div className="integrations-page">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Integrations</h1>
        <p className="text-gray-600">Connect your favorite apps and services to enhance your workflow.</p>
      </div>

      <div className="space-y-4">
        {integrations.map(integration => (
          <IntegrationCard 
            key={integration.id}
            integration={integration}
            onToggleConnection={handleToggleConnection}
          />
        ))}
      </div>
    </div>
  );
}

// Integration Card Component
interface IntegrationCardProps {
  integration: Integration;
  onToggleConnection: (id: string) => void;
}

function IntegrationCard({ integration, onToggleConnection }: IntegrationCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex items-center">
      {/* Logo */}
      <div className="w-16 h-16 flex-shrink-0 mr-6 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
        <img 
          src={integration.logo} 
          alt={`${integration.name} logo`} 
          className="w-14 h-14 object-contain"
          onError={(e) => {
            // Fallback for missing images
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/64/4f46e5/ffffff?text=${integration.name.charAt(0)}`;
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{integration.name}</h3>
        <p className="text-sm text-gray-600">{integration.description}</p>
      </div>

      {/* Action Button */}
      <div className="ml-6">
        <button
          onClick={() => onToggleConnection(integration.id)}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
            integration.isConnected
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
          }`}
        >
          {integration.isConnected ? 'Disconnect' : 'Install'}
        </button>
      </div>
    </div>
  );
}
