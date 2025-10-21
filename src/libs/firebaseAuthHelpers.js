// Helper functions for Firebase Authentication in API routes
import { adminAuth } from './firebaseAdmin';
import { UserModelAdmin } from '@/models/firestore/User';

/**
 * Verify Firebase ID token from request headers
 * @param {Request} req - The request object
 * @returns {Promise<Object|null>} Decoded token or null if invalid
 */
export async function verifyAuthToken(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Get current user from request
 * @param {Request} req - The request object
 * @returns {Promise<Object|null>} User object or null
 */
export async function getCurrentUser(req) {
  try {
    const decodedToken = await verifyAuthToken(req);
    if (!decodedToken) {
      return null;
    }
    
    const user = await UserModelAdmin.findById(decodedToken.uid);
    return user ? { ...user, uid: decodedToken.uid } : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Check if current user is admin
 * @param {Request} req - The request object
 * @returns {Promise<boolean>} True if user is admin
 */
export async function isAdmin(req) {
  try {
    const user = await getCurrentUser(req);
    return user?.admin === true;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

/**
 * Check if current user is authenticated
 * @param {Request} req - The request object
 * @returns {Promise<boolean>} True if user is authenticated
 */
export async function isAuthenticated(req) {
  const decodedToken = await verifyAuthToken(req);
  return decodedToken !== null;
}

/**
 * Require authentication middleware
 * Returns 401 response if not authenticated
 * @param {Request} req - The request object
 * @returns {Promise<Object|Response>} User object or 401 Response
 */
export async function requireAuth(req) {
  const user = await getCurrentUser(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return user;
}

/**
 * Require admin middleware
 * Returns 403 response if not admin
 * @param {Request} req - The request object
 * @returns {Promise<Object|Response>} User object or 403 Response
 */
export async function requireAdmin(req) {
  const user = await getCurrentUser(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!user.admin) {
    return Response.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }
  return user;
}
