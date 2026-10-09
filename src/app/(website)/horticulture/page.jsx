'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flower2, Search, ArrowRight, ShieldCheck, Sprout } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getPublicPlants } from '@/api/horticulture.api';

const CATEGORIES = [
  'All',
  'Fruit Plants',
  'Flowering Plants',
  'Medicinal Plants',
  'Ornamental Plants',
  'Agro Forestry Saplings',
  'Organic Herbs',
];

export default function HorticulturePage() {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getPublicPlants({
      category: selectedCategory === 'All' ? '' : selectedCategory,
      search: searchTerm,
    })
      .then((data) => {
        if (isMounted && Array.isArray(data)) setPlants(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary">Organic Nursery</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-content-main tracking-tight">
          Horticulture & Plant Nursery
        </h1>
        <p className="text-base sm:text-lg text-content-muted leading-relaxed">
          Nurture your garden and agro fields with healthy, organically grown saplings, high-yielding fruit trees, and therapeutic medicinal flora.
        </p>
      </div>

      <Alert variant="info" title="Catalogue Enquiry Notice">
        Items in our nursery catalogue can be requested for farm collection or bulk plantation dispatch. Online payment and instant e-commerce checkout are not active in this MVP.
      </Alert>

      {/* Search and Category Filter */}
      <div className="space-y-4">
        <div className="max-w-md mx-auto">
          <Input
            placeholder="Search plants by name, scientific name, or care notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-content-inverted border-primary shadow-sm'
                  : 'bg-surface text-content-muted border-surface-border hover:bg-surface-muted hover:text-content-main'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plants Grid */}
      {isLoading ? (
        <LoadingSpinner text="Fetching plant catalog..." />
      ) : plants.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-theme border border-surface-border p-8">
          <Flower2 className="w-12 h-12 text-content-light mx-auto mb-3" />
          <h3 className="text-lg font-bold text-content-main">No Plant Listings Found</h3>
          <p className="text-sm text-content-muted mt-1">
            No plants found matching the selected filters. Please adjust your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <Card key={plant._id} hoverEffect padding="p-0" className="flex flex-col group">
              <div className="h-48 bg-surface-muted relative overflow-hidden flex items-center justify-center">
                {plant.images && plant.images.length > 0 ? (
                  <img
                    src={plant.images[0]}
                    alt={plant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Sprout className="w-10 h-10 text-content-light mx-auto mb-1" />
                    <span className="text-xs text-content-muted">Nursery Sapling</span>
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant="primary">{plant.category}</Badge>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <Badge
                    variant={
                      plant.availability === 'In Stock'
                        ? 'success'
                        : plant.availability === 'Out of Stock'
                        ? 'error'
                        : 'warning'
                    }
                  >
                    {plant.availability}
                  </Badge>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-content-main group-hover:text-primary transition-colors">
                    {plant.name}
                  </h3>
                  {plant.scientificName && (
                    <p className="text-xs text-content-light italic mb-1">
                      {plant.scientificName}
                    </p>
                  )}
                  <p className="text-xs text-content-muted line-clamp-2 mt-2 leading-relaxed">
                    {plant.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-primary">₹{plant.price}</span>
                    <span className="text-[11px] text-content-muted"> /{plant.priceBasis || 'piece'}</span>
                  </div>

                  <Link href={`/horticulture/${plant._id}`}>
                    <Button size="sm" variant="outline">
                      Enquire <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
