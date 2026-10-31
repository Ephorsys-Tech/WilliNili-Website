'use client';

import React, { useState, useEffect } from 'react';
import { BedDouble, Plus, Edit, Trash2, Check, X, Eye, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';
import { getAdminRooms, createRoom, updateRoom, archiveRoom } from '@/api/room.api';

const DEFAULT_ROOM = {
  name: '',
  roomType: 'Double',
  isAc: true,
  pricePerNight: 2500,
  priceDisplay: true,
  capacityAdults: 2,
  capacityChildren: 1,
  bedType: 'King Size Bed',
  description: '',
  features: ['Garden View', 'Attached Bathroom', 'Free Wi-Fi'],
  amenities: ['Hot Water', 'Clean Linens', 'Power Backup'],
  images: [],
  isAvailable: true,
};

export default function GuestHouseAdminPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_ROOM);
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState(null);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminRooms({ limit: 100 });
      if (res?.items) setRooms(res.items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenCreate = () => {
    setEditingRoom(null);
    setFormData(DEFAULT_ROOM);
    setShowManualUrl(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || '',
      roomType: room.roomType || 'Double',
      isAc: Boolean(room.isAc),
      pricePerNight: room.pricePerNight || 0,
      priceDisplay: room.priceDisplay !== false,
      capacityAdults: room.capacityAdults || 2,
      capacityChildren: room.capacityChildren || 0,
      bedType: room.bedType || '',
      description: room.description || '',
      features: room.features || [],
      amenities: room.amenities || [],
      images: room.images || [],
      isAvailable: Boolean(room.isAvailable),
    });
    setShowManualUrl(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setAlertState(null);

    try {
      if (editingRoom) {
        await updateRoom(editingRoom._id, formData);
        setAlertState({ type: 'success', message: 'Room updated successfully.' });
      } else {
        await createRoom(formData);
        setAlertState({ type: 'success', message: 'Room created successfully.' });
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error saving room.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async (id) => {
    if (!confirm('Are you sure you want to archive this room? It will be hidden from public view.')) return;
    try {
      await archiveRoom(id);
      setAlertState({ type: 'success', message: 'Room archived.' });
      fetchRooms();
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error archiving room.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-content-main">Rooms Inventory</h2>
          <p className="text-xs text-content-muted">Configure room details, amenities, AC options, and pricing tariffs.</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary">
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Room
        </Button>
      </div>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Success' : 'Notice'}>
          {alertState.message}
        </Alert>
      )}

      {isLoading ? (
        <LoadingSpinner text="Loading rooms inventory..." />
      ) : rooms.length === 0 ? (
        <Card padding="p-8" className="text-center">
          <BedDouble className="w-12 h-12 text-content-light mx-auto mb-3" />
          <p className="text-sm font-semibold text-content-main">No rooms in database</p>
          <p className="text-xs text-content-muted mt-1">Click &quot;Add New Room&quot; above to create the first guest house room.</p>
        </Card>
      ) : (
        <Card padding="p-0" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-content-main">
              <thead className="bg-surface-muted/60 text-content-muted font-semibold uppercase tracking-wider border-b border-surface-border">
                <tr>
                  <th className="p-4">Room Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Climate</th>
                  <th className="p-4">Tariff</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="p-4 font-semibold text-content-main">
                      <div className="flex items-center gap-3">
                        {room.images && room.images[0] ? (
                          <img
                            src={room.images[0]}
                            alt={room.name}
                            className="w-11 h-11 rounded-theme object-cover border border-surface-border flex-shrink-0 shadow-sm"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-theme bg-surface-muted border border-surface-border flex items-center justify-center text-content-muted flex-shrink-0">
                            <BedDouble className="w-5 h-5 text-primary" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{room.name}</div>
                          <div className="text-[11px] text-content-muted font-normal">{room.bedType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{room.roomType}</td>
                    <td className="p-4">
                      <Badge variant={room.isAc ? 'success' : 'neutral'}>
                        {room.isAc ? 'AC' : 'Non-AC'}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-primary">₹{room.pricePerNight}</td>
                    <td className="p-4">{room.capacityAdults} Adults {room.capacityChildren > 0 ? `+ ${room.capacityChildren} Ch` : ''}</td>
                    <td className="p-4">
                      <Badge variant={room.isAvailable ? 'success' : 'neutral'}>
                        {room.isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(room)}
                          className="p-1.5 rounded-theme text-content-muted hover:text-primary hover:bg-surface-muted cursor-pointer"
                          title="Edit Room"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleArchive(room._id)}
                          className="p-1.5 rounded-theme text-content-muted hover:text-status-error hover:bg-surface-muted cursor-pointer"
                          title="Archive Room"
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

      {/* Add / Edit Room Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoom ? `Edit Room: ${editingRoom.name}` : 'Create New Room'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <Input
            label="Room Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Deluxe Garden Room"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Room Type"
              value={formData.roomType}
              onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
              options={['Single', 'Double', 'Family', 'Deluxe', 'Suite']}
              required
            />

            <Select
              label="AC Configuration"
              value={formData.isAc ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, isAc: e.target.value === 'true' })}
              options={[
                { value: 'true', label: 'Air Conditioned (AC)' },
                { value: 'false', label: 'Non-AC' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tariff (₹ per night)"
              type="number"
              min="0"
              value={formData.pricePerNight}
              onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
              required
            />

            <Input
              label="Bed Type"
              value={formData.bedType}
              onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
              placeholder="e.g. King Size Double Bed"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Adult Capacity"
              type="number"
              min="1"
              value={formData.capacityAdults}
              onChange={(e) => setFormData({ ...formData, capacityAdults: Number(e.target.value) })}
              required
            />

            <Input
              label="Children Capacity"
              type="number"
              min="0"
              value={formData.capacityChildren}
              onChange={(e) => setFormData({ ...formData, capacityChildren: Number(e.target.value) })}
            />
          </div>

          <Textarea
            label="Room Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          {/* Room Photo Upload from Device */}
          <div className="space-y-3 pt-2 border-t border-surface-border">
            <CloudinaryUploader
              label="Room Photo (Upload from Device)"
              value={formData.images?.[0] || ''}
              folder="willy_nilly/rooms"
              aspectRatio="aspect-video"
              onChange={(url) => {
                setFormData((prev) => {
                  const rest = (prev.images || []).slice(1);
                  return {
                    ...prev,
                    images: url ? [url, ...rest] : rest,
                  };
                });
              }}
              helpText="Select or drag a room photo from your computer or phone (JPEG, PNG, WebP up to 5MB)."
            />

            {/* Additional Room Photos Gallery (Optional) */}
            <div className="pt-2 border-t border-surface-border/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-content-main flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-primary" />
                  Additional Room Photos ({Math.max(0, (formData.images?.length || 0) - 1)})
                </span>
              </div>

              {/* Display existing additional photos as thumbnails with delete button */}
              {(formData.images?.length || 0) > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {formData.images.slice(1).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden aspect-video border border-surface-border bg-surface-muted"
                    >
                      <img
                        src={imgUrl}
                        alt={`Additional room view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => {
                            const newImages = [...prev.images];
                            newImages.splice(idx + 1, 1);
                            return { ...prev, images: newImages };
                          });
                        }}
                        className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700 shadow-sm cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload extra photo from device */}
              <CloudinaryUploader
                label=""
                value=""
                folder="willy_nilly/rooms"
                aspectRatio="aspect-video"
                onChange={(extraUrl) => {
                  if (extraUrl) {
                    setFormData((prev) => ({
                      ...prev,
                      images: [...(prev.images || []), extraUrl],
                    }));
                  }
                }}
                helpText="Click to upload another photo from your device to add to this room's gallery."
              />
            </div>

            {/* Optional manual URL entry toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowManualUrl(!showManualUrl)}
                className="text-[11px] text-content-muted hover:text-primary transition-colors underline cursor-pointer"
              >
                {showManualUrl ? 'Hide direct URL input' : 'Or enter direct image URL manually'}
              </button>
              {showManualUrl && (
                <div className="mt-2">
                  <Input
                    label="Direct Image URL"
                    value={formData.images?.[0] || ''}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      setFormData((prev) => {
                        const rest = (prev.images || []).slice(1);
                        return {
                          ...prev,
                          images: val ? [val, ...rest] : rest,
                        };
                      });
                    }}
                    placeholder="https://... or /uploads/..."
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.priceDisplay}
                onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span>Display Price Publicly</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span>Mark Available for Requests</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save Room
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
