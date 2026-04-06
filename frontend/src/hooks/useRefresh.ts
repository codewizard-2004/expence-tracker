import { useState, useCallback } from 'react';

/**
 * A reusable hook to handle pull-to-refresh logic.
 * Wraps the provided asynchronous refresh function with loading state management
 * and a minimal artificial delay to ensure the refresh animation stays visible briefly
 * even if the network is extremely fast.
 *
 * @param refreshFunction Function to call when user pulls to refresh
 * @returns { refreshing, onRefresh }
 */
export function useRefresh(refreshFunction: () => Promise<void> | void) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Execute the actual data fetching logic
      await refreshFunction();
      
      // Artificial delay (e.g., 500ms) to allow the native spinner time to animate
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (e) {
      console.error('Error during refresh:', e);
    } finally {
      setRefreshing(false);
    }
  }, [refreshFunction]);

  return { refreshing, onRefresh };
}
