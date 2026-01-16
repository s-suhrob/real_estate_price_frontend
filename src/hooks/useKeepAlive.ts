/**
 * Keep-Alive Hook
 * 
 * Pings the backend every 10 minutes to prevent Render free tier from spinning down.
 * Includes smart features:
 * - Pauses when tab is hidden (Page Visibility API)
 * - Adds jitter (±30s) to avoid synchronized spikes
 * - Uses AbortController with 8s timeout
 * - Handles 429/5xx gracefully without aggressive retries
 * 
 * Limitation: Only works while user keeps the page open.
 */

import { useEffect, useRef } from 'react';

const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
const JITTER_MAX = 30 * 1000; // ±30 seconds
const REQUEST_TIMEOUT = 8 * 1000; // 8 seconds

/**
 * Get backend URL from environment or fallback to hardcoded value
 */
function getBackendUrl(): string {
    if (typeof window !== 'undefined') {
        // Client-side: check for Next.js public env var
        return process.env.NEXT_PUBLIC_API_URL || 'https://real-estate-price-backend.onrender.com';
    }
    return 'https://real-estate-price-backend.onrender.com';
}

/**
 * Add random jitter to interval to avoid synchronized spikes
 * Returns interval ± up to JITTER_MAX milliseconds
 */
function addJitter(baseInterval: number): number {
    const jitter = Math.random() * JITTER_MAX * 2 - JITTER_MAX; // Random value between -JITTER_MAX and +JITTER_MAX
    return Math.max(0, baseInterval + jitter);
}

/**
 * Ping the backend health endpoint
 */
async function pingBackend(): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(`${getBackendUrl()}/api/v1/health`, {
            method: 'GET',
            signal: controller.signal,
            // Don't send credentials for keep-alive pings
            credentials: 'omit',
        });

        clearTimeout(timeoutId);

        // Log errors but don't throw
        if (!response.ok) {
            if (response.status === 429) {
                console.warn('[KeepAlive] Rate limited (429), will retry at next interval');
            } else if (response.status >= 500) {
                console.warn(`[KeepAlive] Server error (${response.status}), will retry at next interval`);
            } else if (response.status === 404) {
                // Health endpoint might not exist, fallback to root
                console.info('[KeepAlive] /health not found, trying root endpoint');
                await pingBackendRoot();
            }
        } else {
            console.debug('[KeepAlive] Ping successful');
        }
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                console.warn('[KeepAlive] Request timeout (8s), will retry at next interval');
            } else {
                console.warn('[KeepAlive] Ping failed:', error.message);
            }
        }
        // Silently fail - don't disrupt user experience
    }
}

/**
 * Fallback: ping root endpoint if /health doesn't exist
 */
async function pingBackendRoot(): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        await fetch(`${getBackendUrl()}/`, {
            method: 'GET',
            signal: controller.signal,
            credentials: 'omit',
        });
        clearTimeout(timeoutId);
        console.debug('[KeepAlive] Root ping successful');
    } catch (error) {
        clearTimeout(timeoutId);
        // Silently fail
    }
}

/**
 * Hook to keep backend alive by pinging every 10 minutes
 * 
 * Usage:
 * ```tsx
 * useKeepAlive();
 * ```
 * 
 * Place in root layout or app component to run once.
 */
export function useKeepAlive(): void {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isTabVisibleRef = useRef<boolean>(true);

    useEffect(() => {
        // Only run in browser
        if (typeof window === 'undefined') return;

        // Initial ping after 1 minute (to verify backend is up)
        const initialTimeout = setTimeout(() => {
            if (isTabVisibleRef.current) {
                pingBackend();
            }
        }, 60 * 1000);

        // Schedule recurring pings with jitter
        function schedulePing() {
            const intervalWithJitter = addJitter(PING_INTERVAL);

            intervalRef.current = setTimeout(() => {
                if (isTabVisibleRef.current) {
                    pingBackend();
                }
                // Schedule next ping
                schedulePing();
            }, intervalWithJitter);
        }

        // Start recurring pings
        schedulePing();

        // Handle Page Visibility API (pause when tab is hidden)
        function handleVisibilityChange() {
            isTabVisibleRef.current = !document.hidden;

            if (document.hidden) {
                console.debug('[KeepAlive] Tab hidden, pausing pings');
            } else {
                console.debug('[KeepAlive] Tab visible, resuming pings');
                // Ping immediately when tab becomes visible
                pingBackend();
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            clearTimeout(initialTimeout);
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
}
