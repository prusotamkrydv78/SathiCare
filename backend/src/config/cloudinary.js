import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Determine folder based on file type
        let folder = 'sathicare/consultations';
        let resourceType = 'auto';

        if (file.mimetype.startsWith('image/')) {
            folder = 'sathicare/consultations/images';
            resourceType = 'image';
        } else if (file.mimetype === 'application/pdf') {
            folder = 'sathicare/consultations/documents';
            resourceType = 'raw';
        } else {
            folder = 'sathicare/consultations/files';
            resourceType = 'raw';
        }

        return {
            folder: folder,
            resource_type: resourceType,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
            transformation: file.mimetype.startsWith('image/')
                ? [{ width: 1000, height: 1000, crop: 'limit' }]
                : undefined
        };
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and PDF documents are allowed.'), false);
    }
};

// Create multer upload instance
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload to Cloudinary directly (alternative method)
export const uploadToCloudinary = async (file, folder = 'sathicare/consultations') => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: folder,
            resource_type: 'auto'
        });

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            size: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return { success: true };
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
        return { success: false, error: error.message };
    }
};

export default { upload, uploadToCloudinary, deleteFromCloudinary };
