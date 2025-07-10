const { uploadImage, deleteImage } = require("./cloudinaryUtils.js");

const testFunction = async () => {
  console.log("testFunction starting...");
  console.log("path is Design/design_docs/imgs/image-1.png");
  console.log("Running upload fucntion...");
  try {
    const result = await uploadImage(
      "../../Design/design_docs/imgs/image-1.png"
    );
    console.log(`File uploaded with public_id: ${result}.`);
  } catch (error) {
    console.log("There was an error: " + JSON.stringify(error, null, 2));
  }

  console.log("testFunction ended.");
};

testFunction();
