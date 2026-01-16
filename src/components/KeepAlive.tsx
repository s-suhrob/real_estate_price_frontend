/**
 * Keep-Alive Component
 * 
 * Client component that runs the keep-alive hook.
 * Used in the root layout to ping backend and prevent Render from spinning down.
 */

'use client';

import { useKeepAlive } from '@/hooks/useKeepAlive';

export function KeepAlive() {
    useKeepAlive();
    return null; // This component doesn't render anything
}
