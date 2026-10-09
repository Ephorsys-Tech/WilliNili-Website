'use client';

import React, { useState, useEffect } from 'react';
import { Store, Plus, Edit, Trash2, Power, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  getAdminShops,
  createShop,
  updateShop,
  archiveShop,
  toggleShopRentalModule,
} from '@/api/shop-rental.api';

const DEFAULT_SHOP = {
  title: '',
  shopNumber: 'S-01',
  sizeSqFt: 250,
  rentAmount: 12000,
  rentPeriod: 'Monthly',
  location: 'Agro Campus Main Entrance Arcade',
  description: '',
  facilities: ['Shutter Door', 'Electricity Connection', 'Front Paved Road'],
  images: [],
  isAvailable: true,
};

export default function ShopRentalAdminPage() {
  const [shops, setShops] = useState([]);
  const [isModuleActive, setIsModuleActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_SHOP);
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState(null);

  const fetchShops = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminShops({ limit: 100 });
      if (res?.items) {
        setShops(res.items);
        setIsModuleActive(Boolean(res.isModuleActive));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleToggleModule = async () => {
    const nextState = !isModuleActive;
    const confirmMsg = nextState
      ? 'Activate the Shop Rental module? Commercial shop listings and public enquiry forms will become immediately visible on the public website.'
      : 'Deactivate the Shop Rental module? The category will be completely hidden from public menus, and all public shop listings/enquiry endpoints will be blocked (404).';

    if (!confirm(confirmMsg)) return;

    try {
      setIsToggling(true);
      await toggleShopRentalModule(nextState);
      setIsModuleActive(nextState);
      setAlertState({
        type: 'success',
        message: `Shop Rental module is now ${nextState ? 'ACTIVATED and visible publicly' : 'DEACTIVATED and hidden from public visitors'}.`,
      });
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error toggling module state.' });
    } finally {
      setIsToggling(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingShop(null);
    setFormData(DEFAULT_SHOP);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingShop(s);
    setFormData({
      title: s.title || '',
      shopNumber: s.shopNumber || '',
      sizeSqFt: s.sizeSqFt || 200,
      rentAmount: s.rentAmount || 0,
      rentPeriod: s.rentPeriod || 'Monthly',
      location: s.location || '',
      description: s.description || '',
      facilities: s.facilities || [],
      images: s.images || [],
      isAvailable: Boolean(s.isAvailable),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setAlertState(null);

    try {
      if (editingShop) {
        await updateShop(editingShop._id, formData);
        setAlertState({ type: 'success', message: 'Shop details updated.' });
      } else {
        await createShop(formData);
        setAlertState({ type: 'success', message: 'Shop listing created.' });
      }
      setIsModalOpen(false);
      fetchShops();
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error saving shop.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async (id) => {
    if (!confirm('Archive this shop listing?')) return;
    try {
      await archiveShop(id);
      setAlertState({ type: 'success', message: 'Shop archived.' });
      fetchShops();
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error archiving shop.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Module Activation Controller */}
      <Card
        padding="p-6"
        className={`border-2 transition-all ${
          isModuleActive ? 'border-emerald-300 bg-emerald-50/30' : 'border-amber-300 bg-amber-50/30'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-content-main" />
              <h3 className="text-base font-bold text-content-main">
                Public Shop Rental Module Activation
              </h3>
              <Badge variant={isModuleActive ? 'success' : 'warning'}>
                {isModuleActive ? 'Active' : 'Inactive (Default)'}
              </Badge>
            </div>
            <p className="text-xs text-content-muted leading-relaxed max-w-2xl">
              {isModuleActive
                ? 'The module is currently ACTIVE. Public visitors can view the Shop Rental navigation link, browse listed shops, and submit rental enquiries.'
                : 'The module is currently INACTIVE (per PRD requirement). The public navigation link is hidden, and direct access to /shop-rental returns 404.'}
            </p>
          </div>

          <Button
            onClick={handleToggleModule}
            variant={isModuleActive ? 'outline' : 'primary'}
            isLoading={isToggling}
            className="flex-shrink-0"
          >
            <Power className="w-4 h-4 mr-2" />
            {isModuleActive ? 'Deactivate Module' : 'Activate Module'}
          </Button>
        </div>
      </Card>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Success' : 'Notice'}>
          {alertState.message}
        </Alert>
      )}

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-content-main">Commercial Units Inventory</h2>
          <p className="text-xs text-content-muted">Manage available commercial spaces, square footage, rent, and lease terms.</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Commercial Shop
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading shop inventory..." />
      ) : shops.length === 0 ? (
        <Card padding="p-8" className="text-center">
          <Store className="w-12 h-12 text-content-light mx-auto mb-3" />
          <p className="text-sm font-semibold text-content-main">No shop records created</p>
          <p className="text-xs text-content-muted mt-1">Configure your first commercial unit using the button above.</p>
        </Card>
      ) : (
        <Card padding="p-0" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-content-main">
              <thead className="bg-surface-muted/60 text-content-muted font-semibold uppercase tracking-wider border-b border-surface-border">
                <tr>
                  <th className="p-4">Unit #</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Dimensions</th>
                  <th className="p-4">Rent</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {shops.map((s) => (
                  <tr key={s._id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary">{s.shopNumber}</td>
                    <td className="p-4 font-semibold text-content-main">
                      <div className="flex items-center gap-3">
                        {s.images && s.images[0] ? (
                          <img
                            src={s.images[0]}
                            alt={s.title}
                            className="w-11 h-11 rounded-theme object-cover border border-surface-border flex-shrink-0 shadow-sm"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-theme bg-surface-muted border border-surface-border flex items-center justify-center text-content-muted flex-shrink-0">
                            <Store className="w-5 h-5 text-primary" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{s.title}</div>
                          <div className="text-[11px] text-content-muted font-normal">{s.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{s.sizeSqFt} Sq. Ft.</td>
                    <td className="p-4 font-bold text-content-main">₹{s.rentAmount} /{s.rentPeriod}</td>
                    <td className="p-4 text-content-muted">{s.location}</td>
                    <td className="p-4">
                      <Badge variant={s.isAvailable ? 'success' : 'neutral'}>
                        {s.isAvailable ? 'Available' : 'Occupied'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded-theme text-content-muted hover:text-primary hover:bg-surface-muted"
                          title="Edit Shop"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleArchive(s._id)}
                          className="p-1.5 rounded-theme text-content-muted hover:text-status-error hover:bg-surface-muted"
                          title="Archive Shop"
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

      {/* Add / Edit Shop Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShop ? `Edit Shop: ${editingShop.title}` : 'Add Commercial Shop Unit'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Shop Unit Number"
              value={formData.shopNumber}
              onChange={(e) => setFormData({ ...formData, shopNumber: e.target.value })}
              placeholder="e.g. S-01"
              required
            />
            <Input
              label="Shop Title / Heading"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Front Corner Commercial Shop"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Size (Sq. Ft.)"
              type="number"
              min="10"
              value={formData.sizeSqFt}
              onChange={(e) => setFormData({ ...formData, sizeSqFt: Number(e.target.value) })}
              required
            />
            <Input
              label="Rent Amount (₹)"
              type="number"
              min="0"
              value={formData.rentAmount}
              onChange={(e) => setFormData({ ...formData, rentAmount: Number(e.target.value) })}
              required
            />
            <Select
              label="Rent Period"
              value={formData.rentPeriod}
              onChange={(e) => setFormData({ ...formData, rentPeriod: e.target.value })}
              options={['Monthly', 'Quarterly', 'Annual']}
              required
            />
          </div>

          <Input
            label="Location Description"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Main Entrance Gate Complex, Ground Floor"
            required
          />

          <Textarea
            label="Shop Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <Input
            label="Image URL"
            value={formData.images[0] || ''}
            onChange={(e) => setFormData({ ...formData, images: [e.target.value].filter(Boolean) })}
            placeholder="https://... or /uploads/..."
          />

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="rounded text-primary focus:ring-primary"
            />
            <span>Mark Unit Available for Rent</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save Shop Unit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
