import React, { useState, useEffect } from 'react';
import { fetchMaterials, updateMaterialQuantity, Material } from '../api/materials';
import { MaterialRow } from './MaterialRow';
import { MaterialInspectionModal } from './MaterialInspectionModal';

interface MaterialsListProps {
  searchTerm: string;
  selectedTags: string[];
  refreshTrigger: number;
  sortBy: string | null;
}

export function MaterialsList({ 
  searchTerm, 
  selectedTags, 
  refreshTrigger,
  sortBy
}: MaterialsListProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inspectedMaterial, setInspectedMaterial] = useState<Material | null>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);

  // Fetch materials from API when component mounts
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        const data = await fetchMaterials();
        setMaterials(data);
        setError(null);
      } catch (err) {
        setError('Failed to load materials. Please try again.');
        console.error('Error loading materials:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  // Filter materials based on search term and selected tags
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => material.tags.includes(tag));
    return matchesSearch && matchesTags;
  });
  
  // Sort materials based on sortBy parameter
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (!sortBy) return 0; // No sorting
    
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'quantity') {
      return b.quantity - a.quantity; // Sort by quantity descending
    }
    
    return 0;
  });

  // Handle quantity updates
  const handleQuantityUpdate = async (materialId: number, newQuantity: number) => {
    try {
      const updatedMaterial = await updateMaterialQuantity(materialId, newQuantity);
      
      // Update the local state with the new quantity
      setMaterials(prevMaterials =>
        prevMaterials.map(material =>
          material.id === materialId ? updatedMaterial : material
        )
      );
      
      // Also update the inspected material if it's currently being viewed
      if (inspectedMaterial && inspectedMaterial.id === materialId) {
        setInspectedMaterial(updatedMaterial);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      // You could show an error message to the user here
    }
  };
  
  // Handle material inspection
  const handleInspect = (material: Material) => {
    setInspectedMaterial(material);
    setIsInspectionModalOpen(true);
  };
  
  // Close inspection modal
  const handleCloseInspection = () => {
    setIsInspectionModalOpen(false);
  };

  if (loading) {
    return (
      <div className="loading-state p-8 text-center">
        <p>Loading materials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state p-8 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="materials-list">
      {sortedMaterials.map(material => (
        <MaterialRow
          key={material.id}
          product={material} // Still using 'product' prop name for compatibility
          onQuantityUpdate={handleQuantityUpdate}
          onInspect={handleInspect}
        />
      ))}
      
      {/* Material Inspection Modal */}
      <MaterialInspectionModal
        isOpen={isInspectionModalOpen}
        onClose={handleCloseInspection}
        material={inspectedMaterial}
      />
    </div>
  );
}
