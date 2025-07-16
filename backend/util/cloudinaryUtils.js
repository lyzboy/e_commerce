const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
// Require the cloudinary library
const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
});

// Log the configuration
//console.log(cloudinary.config());

const uploadImage = async (imagePath, imageName) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: false,
    unique_filename: true,
    overwrite: true,
    display_name: imageName,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error("Error in AMS: " + error);
    throw error;
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
    return result.url;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteImage = async (publicId) => {
  const options = {};
  try {
    const result = await cloudinary.uploader.destroy(publicId, options);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { uploadImage, getAssetInfo, deleteImage };
