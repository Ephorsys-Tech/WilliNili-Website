'use client';

import React, { useState, useEffect } from 'react';
import { Flower2, Plus, Edit, Trash2, Sprout, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getAdminPlants, createPlant, updatePlant, archivePlant } from '@/api/horticulture.api';

const DEFAULT_PLANT = {
  name: '',
  scientificName: '',
  category: 'Fruit Plants',
  description: '',
  price: 250,
  priceBasis: 'per sapling',
  availability: 'In Stock',
  careInstructions: 'Water regularly with organic manure; needs sunlight.',
  heightSize: '1-2 Feet Nursery Pot',
  images: [],
};

const CATEGORIES = [
  'Fruit Plants',
  'Flowering Plants',
  'Medicinal Plants',
  'Ornamental Plants',
  'Agro Forestry Saplings',
  'Organic Herbs',
  'Other',
];

export default function HorticultureAdminPage() {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_PLANT);
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState(null);

  const fetchPlants = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminPlants({ limit: 100 });
      if (res?.items) setPlants(res.items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleOpenCreate = () => {
    setEditingPlant(null);
    setFormData(DEFAULT_PLANT);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPlant(p);
    setFormData({
      name: p.name || '',
      scientificName: p.scientificName || '',
      category: p.category || 'Fruit Plants',
      description: p.description || '',
      price: p.price || 0,
      priceBasis: p.priceBasis || 'per sapling',
      availability: p.availability || 'In Stock',
      careInstructions: p.careInstructions || '',
      heightSize: p.heightSize || '',
      images: p.images || [],
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setAlertState(null);

    try {
      if (editingPlant) {
        await updatePlant(editingPlant._id, formData);
        setAlertState({ type: 'success', message: 'Plant listing updated successfully.' });
      } else {
        await createPlant(formData);
        setAlertState({ type: 'success', message: 'Plant listing created successfully.' });
      }
      setIsModalOpen(false);
      fetchPlants();
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error saving plant.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async (id) => {
    if (!confirm('Archive this plant listing? It will no longer show on the public catalogue.')) return;
    try {
      await archivePlant(id);
      setAlertState({ type: 'success', message: 'Plant listing archived.' });
      fetchPlants();
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error archiving plant.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-content-main">Horticulture Nursery Catalogue</h2>
          <p className="text-xs text-content-muted">Manage available flora, scientific descriptions, pricing, and stock.</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Plant Listing
        </Button>
      </div>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Success' : 'Notice'}>
          {alertState.message}
        </Alert>
      )}

      {isLoading ? (
        <LoadingSpinner text="Loading plant catalog..." />
      ) : plants.length === 0 ? (
        <Card padding="p-8" className="text-center">
          <Flower2 className="w-12 h-12 text-content-light mx-auto mb-3" />
          <p className="text-sm font-semibold text-content-main">No plant listings yet</p>
          <p className="text-xs text-content-muted mt-1">Click &quot;Add Plant Listing&quot; to populate your horticulture catalogue.</p>
        </Card>
      ) : (
        <Card padding="p-0" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-content-main">
              <thead className="bg-surface-muted/60 text-content-muted font-semibold uppercase tracking-wider border-b border-surface-border">
                <tr>
                  <th className="p-4">Plant Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Scientific Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {plants.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="p-4 font-semibold text-content-main">
                      <div className="flex items-center gap-3">
                        {p.images && p.images[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-11 h-11 rounded-theme object-cover border border-surface-border flex-shrink-0 shadow-sm"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-theme bg-surface-muted border border-surface-border flex items-center justify-center text-content-muted flex-shrink-0">
                            <Flower2 className="w-5 h-5 text-primary" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{p.name}</div>
                          {p.scientificName && (
                            <div className="text-[11px] text-content-muted italic font-normal">{p.scientificName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4 italic text-content-light">{p.scientificName || '-'}</td>
                    <td className="p-4 font-bold text-primary">₹{p.price} /{p.priceBasis || 'pc'}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          p.availability === 'In Stock'
                            ? 'success'
                            : p.availability === 'Out of Stock'
                            ? 'error'
                            : 'warning'
                        }
                      >
                        {p.availability}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-theme text-content-muted hover:text-primary hover:bg-surface-muted"
                          title="Edit Plant"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleArchive(p._id)}
                          className="p-1.5 rounded-theme text-content-muted hover:text-status-error hover:bg-surface-muted"
                          title="Archive Plant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit Plant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlant ? `Edit Plant: ${editingPlant.name}` : 'Add New Horticulture Listing'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Plant Common Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Botanical / Scientific Name"
              value={formData.scientificName}
              onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
              placeholder="e.g. Mangifera indica"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Plant Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={CATEGORIES}
              required
            />
            <Select
              label="Stock Availability"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              options={['In Stock', 'Out of Stock', 'Pre-order']}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />
            <Input
              label="Price Basis"
              value={formData.priceBasis}
              onChange={(e) => setFormData({ ...formData, priceBasis: e.target.value })}
              placeholder="e.g. per sapling"
            />
          </div>

          <Textarea
            label="Plant Description & Features"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Standard Pot / Height Size"
              value={formData.heightSize}
              onChange={(e) => setFormData({ ...formData, heightSize: e.target.value })}
              placeholder="e.g. 2-3 Feet Bag"
            />
            <Input
              label="Image URL"
              value={formData.images[0] || ''}
              onChange={(e) => setFormData({ ...formData, images: [e.target.value].filter(Boolean) })}
              placeholder="https://... or /uploads/..."
            />
          </div>

          <Textarea
            label="Care & Cultivation Instructions"
            value={formData.careInstructions}
            onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
            rows={2}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save Plant Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
