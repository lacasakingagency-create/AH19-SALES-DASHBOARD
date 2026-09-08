import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe extraction of public environment variables
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClientInstance) return supabaseClientInstance;

  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
    try {
      supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return supabaseClientInstance;
    } catch (err) {
      console.warn('Supabase client initialization warning:', err);
      return null;
    }
  }

  return null;
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes('your-project') &&
      supabaseAnonKey !== 'your-anon-key'
  );
};

/**
 * Subscribes to real-time sales / orders updates in Supabase
 */
export function subscribeToOrders(onNewOrder: (order: any) => void): () => void {
  const client = getSupabaseClient();
  if (!client) {
    // Return dummy unsubscribe if Supabase is not configured
    return () => {};
  }

  try {
    const channel = client
      .channel('realtime_sales_hub')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.new) {
            onNewOrder(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return () => {};
  }
}
