'use client';

import { useAuth } from '@/components/FirebaseAuthContext';
import { auth } from '@/libs/firebase';

/**
 * Hook for making authenticated API requests
 * Automatically includes Firebase ID token in Authorization header
 */
export function useAuthenticatedFetch() {
  const { user } = useAuth();

  const authenticatedFetch = async (url, options = {}) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Get current ID token
      const idToken = await auth.currentUser?.getIdToken();
      
      if (!idToken) {
        throw new Error('Failed to get authentication token');
      }

      // Add Authorization header
      const headers = {
        ...options.headers,
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      };

      // Make the request
      const response = await fetch(url, {
        ...options,
        headers,
      });

      return response;
    } catch (error) {
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  };

  return authenticatedFetch;
}

/**
 * Helper function to make authenticated API calls with automatic JSON parsing
 */
export function useAuthenticatedApi() {
  const authenticatedFetch = useAuthenticatedFetch();

  const api = {
    get: async (url) => {
      const response = await authenticatedFetch(url, { method: 'GET' });
      return response.json();
    },

    post: async (url, data) => {
      const response = await authenticatedFetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    put: async (url, data) => {
      const response = await authenticatedFetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (url) => {
      const response = await authenticatedFetch(url, { method: 'DELETE' });
      return response.json();
    },
  };

  return api;
}
