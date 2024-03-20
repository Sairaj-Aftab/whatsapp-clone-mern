import multer from "multer";

// multer storage
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + Math.round(Math.random() * 1000000) + "-" + file.fieldname
    );
  },
});

// multer for brand logo
export const profilePhoto = multer({ storage }).single("photo");
export const sendPhoto = multer({ storage }).single("sendPhoto");
export const productPhoto = multer({ storage }).array("productPhoto");
