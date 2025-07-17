// pages/api/upload.js
import formidable from 'formidable';
import { uploadImage } from '../../lib/cloudinary';
import { verifyJWT } from '../../lib/auth';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      filter: ({ mimetype }) => {
        // Only allow images
        return mimetype && mimetype.includes('image');
      },
    });

    const [fields, files] = await form.parse(req);

    if (!files.images || files.images.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    const uploadPromises = files.images.map(async (file) => {
      try {
        // Read file as base64
        const fileBuffer = fs.readFileSync(file.filepath);
        const base64File = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;
        
        // Upload to Cloudinary
        const imageUrl = await uploadImage(base64File, 'haulix/packages');
        
        // Clean up temp file
        fs.unlinkSync(file.filepath);
        
        return imageUrl;
      } catch (error) {
        console.error('Upload error for file:', file.originalFilename, error);
        throw error;
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      message: 'Images uploaded successfully',
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum is 5 files.' });
    }
    
    res.status(500).json({ message: 'Upload failed' });
  }
}
