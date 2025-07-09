// Require the cloudinary library
import { v2 as cloudinary } from "cloudinary";

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
});

// Log the configuration
console.log(cloudinary.config());

const uploadImage = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

const getAssetInfo = async (publicId) => {
  // Return colors in the response
  const options = {
    eager: true,
  };

  try {
    // Get details about the asset
    const result = await cloudinary.api.resource(publicId, options);
    console.log(result);
    return result.eager.url;
  } catch (error) {
    console.error(error);
  }
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.api.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { uploadImage, getAssetInfo, deleteImage };
