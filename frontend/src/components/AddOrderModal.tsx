import React, { useState } from 'react';
import { createOrder, OrderStatus } from '../api/orders';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderAdded: () => void;
}

export function AddOrderModal({ isOpen, onClose, onOrderAdded }: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    orderFrom: '',
    contactInfo: '',
    description: '',
    quantity: 1,
    scheduledDelivery: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
    status: OrderStatus.CREATED
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? (parseInt(value) || 0) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderFrom.trim()) {
      setError('Order source is required');
      return;
    }

    if (!formData.contactInfo.trim()) {
      setError('Contact information is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createOrder({
        orderFrom: formData.orderFrom.trim(),
        contactInfo: formData.contactInfo.trim(),
        description: formData.description.trim(),
        quantity: formData.quantity,
        scheduledDelivery: new Date(formData.scheduledDelivery).toISOString(),
        status: formData.status
      });

      // Reset form
      setFormData({
        orderFrom: '',
        contactInfo: '',
        description: '',
        quantity: 1,
        scheduledDelivery: new Date().toISOString().slice(0, 16),
        status: OrderStatus.CREATED
      });

      onOrderAdded();
      onClose();
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error('Error creating order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Order</h2>
          <button 
            className="modal-close-button" 
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-product-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g. Red Cotton Fabric"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="orderFrom">Order From *</label>
            <input
              type="text"
              id="orderFrom"
              name="orderFrom"
              value={formData.orderFrom}
              onChange={handleInputChange}
              placeholder="e.g. Supplier Company"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactInfo">Contact Information *</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              placeholder="e.g. email@example.com or (123) 456-7890"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="scheduledDelivery">Scheduled Delivery *</label>
            <input
              type="datetime-local"
              id="scheduledDelivery"
              name="scheduledDelivery"
              value={formData.scheduledDelivery}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>


          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
