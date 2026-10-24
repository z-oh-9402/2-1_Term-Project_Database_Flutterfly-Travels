const multer = require('multer');
const crypto = require('crypto');

// Uploaded photos (profile and chat) are stored in a public bucket of the Supabase storage set in .env
// (SUPABASE_BUCKET), and users.photo holds the photo's URL
const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET;
const PUBLIC_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
const EXTENSIONS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };

// The photo stays in memory until it is sent to Supabase; a file that isn't an image is ignored
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB
    },
    fileFilter: (req, file, cb) => cb(null, file.mimetype in EXTENSIONS)
});

const storageRequest = (name, options) => fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${name}`, {
    ...options,
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, ...options.headers }
});

// Uploads a profile or chat photo and returns its public URL, to store in users.photo (or message.image)
const savePhoto = async (file) => {
    // uploads are the only thing that needs Supabase, so the app runs without it until someone sends a photo
    if (!SUPABASE_URL || !SUPABASE_KEY || !BUCKET) {
        throw new Error('Photo uploads need SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SUPABASE_BUCKET in Backend/.env');
    }
    const name = Date.now() + '-' + crypto.randomBytes(4).toString('hex') + EXTENSIONS[file.mimetype];
    const response = await storageRequest(name, {
        method: 'POST',
        headers: { 'Content-Type': file.mimetype, 'Cache-Control': 'max-age=31536000' },
        body: file.buffer
    });
    if (!response.ok) {
        throw new Error(`Uploading the photo failed: Supabase answered HTTP ${response.status}`);
    }
    return PUBLIC_URL + name;
}

// Removes a profile or chat photo from Supabase (anything that isn't one of our photo URLs is left alone)
const deletePhoto = async (photo) => {
    if (!BUCKET || !photo || !photo.startsWith(PUBLIC_URL)) {
        return;
    }
    try {
        const response = await storageRequest(photo.slice(PUBLIC_URL.length), { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Supabase answered HTTP ${response.status}`);
        }
        console.log('Photo deleted successfully');
    }
    catch (err) {
        console.error('Error deleting photo:', err.message);
    }
}

exports.upload = upload;
exports.savePhoto = savePhoto;
exports.deletePhoto = deletePhoto;
