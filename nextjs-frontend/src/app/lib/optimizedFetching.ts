import { client, freshClient, monitoredFetch } from '../sanity/client';

// Advanced caching system with memory and localStorage
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

class OptimizedCache {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_MEMORY_ENTRIES = 100;

  // Generate cache key from query and params
  private generateKey(query: string, params: any = {}): string {
    return `${query}_${JSON.stringify(params)}`.replace(/\s+/g, '');
  }

  // Check if cache entry is valid
  private isValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  // Get from memory cache
  get<T>(query: string, params: any = {}): T | null {
    const key = this.generateKey(query, params);
    const entry = this.memoryCache.get(key);
    
    if (entry && this.isValid(entry)) {
      return entry.data;
    }
    
    // Clean up expired entry
    if (entry) {
      this.memoryCache.delete(key);
    }
    
    return null;
  }

  // Set in memory cache
  set<T>(query: string, params: any = {}, data: T, ttl = this.DEFAULT_TTL): void {
    const key = this.generateKey(query, params);
    
    // Prevent memory overflow
    if (this.memoryCache.size >= this.MAX_MEMORY_ENTRIES) {
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        this.memoryCache.delete(firstKey);
      }
    }
    
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      key
    });
  }

  // Clear cache
  clear(): void {
    this.memoryCache.clear();
  }

  // Get cache stats
  getStats() {
    const entries = Array.from(this.memoryCache.values());
    const validEntries = entries.filter(entry => this.isValid(entry));
    
    return {
      total: entries.length,
      valid: validEntries.length,
      expired: entries.length - validEntries.length,
      memoryUsage: this.memoryCache.size
    };
  }
}

// Global cache instance
const optimizedCache = new OptimizedCache();

// Optimized fetch function with caching and performance monitoring
export async function optimizedFetch<T>(
  query: string,
  params: any = {},
  options: {
    ttl?: number;
    useCache?: boolean;
    useFreshClient?: boolean;
    tags?: string[];
  } = {}
): Promise<T> {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    useCache = true,
    useFreshClient = false,
    tags = []
  } = options;

  // Try cache first
  if (useCache) {
    const cached = optimizedCache.get<T>(query, params);
    if (cached) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🎯 Cache hit for query:', query.substring(0, 50) + '...');
      }
      return cached;
    }
  }

  // Choose client based on requirements
  const clientToUse = useFreshClient ? freshClient : client;
  
  // Prepare Next.js options
  const nextOptions = {
    next: {
      revalidate: Math.floor(ttl / 1000), // Convert to seconds
      tags: tags.length > 0 ? tags : ['sanity-data']
    }
  };

  try {
    // Fetch with performance monitoring
    const data = await monitoredFetch<T>(query, params, nextOptions, clientToUse);
    
    // Cache the result
    if (useCache && data) {
      optimizedCache.set(query, params, data, ttl);
    }
    
    return data;
  } catch (error) {
    console.error('Optimized fetch error:', error);
    throw error;
  }
}

// Batch fetch multiple queries in parallel
export async function batchFetch<T extends Record<string, any>>(
  queries: Array<{
    key: string;
    query: string;
    params?: any;
    options?: Parameters<typeof optimizedFetch>[2];
  }>
): Promise<T> {
  const promises = queries.map(async ({ key, query, params, options }) => {
    try {
      const data = await optimizedFetch(query, params, options);
      return { key, data, error: null };
    } catch (error) {
      return { key, data: null, error };
    }
  });

  const results = await Promise.allSettled(promises);
  const output = {} as T;

  results.forEach((result, index) => {
    const { key } = queries[index];
    if (result.status === 'fulfilled') {
      const { data, error } = result.value;
      if (error) {
        console.error(`Batch fetch error for ${key}:`, error);
        output[key as keyof T] = null as any;
      } else {
        output[key as keyof T] = data as T[keyof T];
      }
    } else {
      console.error(`Batch fetch failed for ${key}:`, result.reason);
      output[key as keyof T] = null as any;
    }
  });

  return output;
}

// Preload data for better performance
export function preloadData<T>(
  query: string,
  params: any = {},
  options: Parameters<typeof optimizedFetch>[2] = {}
): Promise<T> {
  // Start fetching but don't wait for it
  return optimizedFetch<T>(query, params, { ...options, useCache: true });
}

// Cache management utilities
export const cacheUtils = {
  clear: () => optimizedCache.clear(),
  stats: () => optimizedCache.getStats(),
  
  // Warm up cache with common queries
  warmUp: async (commonQueries: Array<{ query: string; params?: any }>) => {
    const promises = commonQueries.map(({ query, params }) =>
      optimizedFetch(query, params, { useCache: true }).catch(() => null)
    );
    
    await Promise.allSettled(promises);
    console.log('🔥 Cache warmed up with', commonQueries.length, 'queries');
  }
};

// Export cache instance for debugging
export { optimizedCache };
