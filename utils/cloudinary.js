import cloudinary from "cloudinary";
import fs from "fs";

// config cloudinary
cloudinary.v2.config({
  cloud_name: "dkomaesw3",
  api_key: "638516122941861",
  api_secret: "sntgV2zyTTIp0z280SfiqYD2caE",
});

// export const cloudUpload = async (req) => {
//   // upload brand logo
//   const data = await cloudinary.v2.uploader.upload(req.file.path);
//   return data;
// };

export const cloudUpload = async (path) => {
  // upload brand logo
  const data = await cloudinary.v2.uploader.upload(path);
  return data;
};

export const cloudDelete = async (url) => {
  let parts = url.split("/");
  let imageNameWithExtension = parts[parts.length - 1]; // Extracts "lvabmyzppn4ytyh7cysa.jpg"
  let publicId = imageNameWithExtension.split(".")[0]; // Extracts "lvabmyzppn4ytyh7cysa"

  await cloudinary.v2.uploader.destroy(publicId);
};
