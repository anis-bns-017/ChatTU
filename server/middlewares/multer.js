import multer from "multer";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 1024 * 1024 * 15, // 15MB
    files: 1 // For singleAvatar
  },
  fileFilter
});

export const singleAvatar = multerUpload.single("avatar");
export const attachmentsMulter = multerUpload.array("files", 10);