import multer from "multer";

export const multerUpload = multer({
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
}); // Expecting a single file with the field name 'avatar'


export const singleAvatar = multerUpload.single("avatar");

export const attachmentsMulter = multerUpload.array("files", 10);
