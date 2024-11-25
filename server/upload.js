import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../src/s3Config.js';

const upload = multer({
  storage: multerS3({
    s3: s3, // Use the configured S3 client
    bucket: process.env.AWS_S3_BUCKET, // Bucket name from .env
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName); // Generate a unique file name for the bucket
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPG, PNG, and MP4 are allowed.'));
    }
    cb(null, true);
  },
});

export default upload;
