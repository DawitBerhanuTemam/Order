// FIREBASE VERSION - Replace route.js with this after migration
import { CategoryModelAdmin } from "@/models/firestore/Category";
import { adminAuth } from "@/libs/firebaseAdmin";

// Helper function to check if user is admin
async function isAdmin(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return false;
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userEmail = decodedToken.email;
    
    if (!userEmail) {
      return false;
    }
    
    // Check if user has admin flag in Firestore
    const { UserModelAdmin } = await import('@/models/firestore/User');
    const user = await UserModelAdmin.findById(decodedToken.uid);
    
    return user?.admin === true;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();
    
    if (await isAdmin(req)) {
      const category = await CategoryModelAdmin.create({ name });
      return Response.json(category);
    } else {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, name } = await req.json();
    
    if (await isAdmin(req)) {
      await CategoryModelAdmin.update(id, { name });
      return Response.json({ success: true });
    } else {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await CategoryModelAdmin.getAll();
    return Response.json(categories);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return Response.json({ error: 'Missing id parameter' }, { status: 400 });
    }
    
    if (await isAdmin(req)) {
      await CategoryModelAdmin.delete(id);
      return Response.json({ success: true });
    } else {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
