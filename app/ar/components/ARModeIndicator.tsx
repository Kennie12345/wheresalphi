'use client';

import { Badge } from '@/components/ui/badge';
import { getARModeDisplayName, type ARMode } from '@/lib/ar-support';

interface ARModeIndicatorProps {
    mode: ARMode;
}

export default function ARModeIndicator({ mode }: ARModeIndicatorProps) {
    const getModeBadgeColor = (mode: ARMode) => {
        switch (mode) {
            case 'webxr':
                return 'bg-green-500 text-white';
            case 'image-tracking':
                return 'bg-blue-500 text-white';
            case 'overlay':
                return 'bg-yellow-500 text-black';
            case 'unsupported':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getModeIcon = (mode: ARMode) => {
        switch (mode) {
            case 'webxr':
                return '🥽';
            case 'image-tracking':
                return '🎯';
            case 'overlay':
                return '📱';
            case 'unsupported':
                return '❌';
            default:
                return '❓';
        }
    };

    return (
        <div className="absolute top-4 left-4 z-50">
            <Badge className={`${getModeBadgeColor(mode)} border-0 px-3 py-1`}>
                <span className="mr-2">{getModeIcon(mode)}</span>
                {getARModeDisplayName(mode)}
            </Badge>
        </div>
    );
}