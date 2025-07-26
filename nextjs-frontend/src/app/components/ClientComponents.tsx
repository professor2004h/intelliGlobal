'use client';

// EMERGENCY FIX: Direct imports to eliminate ALL chunk loading issues
// All dynamic imports have been removed to prevent ChunkLoadError

export { default as AutoRefresh } from "./AutoRefresh";
export { default as FaviconManager } from "./FaviconManager";
export { default as CacheBuster } from "./CacheBuster";
export { default as PerformanceMonitor } from "./PerformanceMonitor";
export { default as ConnectionStatus } from "./ConnectionStatus";
export { default as PerformanceInit } from "./PerformanceInit";

// ClientErrorBoundary is imported directly in layout.tsx
