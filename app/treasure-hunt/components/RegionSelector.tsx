'use client';

import { MapPin, ChevronDown } from 'lucide-react';
import { Region } from '@/lib/treasure-hunt/types';

interface RegionSelectorProps {
    regions: Region[];
    selectedRegion: Region;
    onRegionChange: (region: Region) => void;
}

export default function RegionSelector({ regions, selectedRegion, onRegionChange }: RegionSelectorProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Your Region
            </label>
            <div className="relative">
                <select
                    value={selectedRegion.key}
                    onChange={(e) => {
                        const region = regions.find(r => r.key === e.target.value);
                        if (region) onRegionChange(region);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                    {regions.map((region) => (
                        <option key={region.key} value={region.key}>
                            {region.name} (≈{Math.round(region.radiusM / 1000)}km radius)
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>
                    Center: {selectedRegion.center.lat.toFixed(4)}, {selectedRegion.center.lon.toFixed(4)}
                </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
                8 treasure spots will be scattered within this region
            </p>
        </div>
    );
}