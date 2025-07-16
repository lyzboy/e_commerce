const {
  uploadImage,
  deleteImage,
  getAssetInfo,
} = require("./cloudinaryUtils.js");

const testFunction = async () => {
  console.log("testFunction starting...");
  console.log("path is Design/design_docs/imgs/image-1.png");
  console.log("Running upload function...");
  try {
    const result = await uploadImage(
      "../../Design/design_docs/imgs/image-1.png",
      "A screenshot of website"
    );
    console.log(`File uploaded with public_id: ${result}.`);
    const publicId = result;
    console.log("Getting the asset information...");
    const infoResults = await getAssetInfo(publicId);
    console.log("Asset info is: " + infoResults);
    console.log("Deleting uploaded image...");
    let newResults = await deleteImage(publicId);
    console.log("Delete results: " + newResults);
    console.log(
      `Image ${result.display_name} with public_id (${publicId}) deleted.`
    );
  } catch (error) {
    console.log("There was an error: " + JSON.stringify(error, null, 2));
  }

  console.log("testFunction ended.");
};

testFunction();
