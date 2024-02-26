// --------------------IMAGE FILE LOGIC----------------------------------
async function addImage(file) {
  if (!file) return null;

  // setting up the request body object
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "nology"); 
  data.append("cloud_name", "dmavbbqol");

  try {
    // using unsigned upload preset to upload image to cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/dmavbbqol/upload`, {
      method: 'post',
      body: data,
    });

    if (response.ok) {
      const cloudinaryData = await response.json();
      const imageUrl = cloudinaryData.secure_url;
      return imageUrl;
    } else {
      console.error('Failed to upload image to Cloudinary');
      return null;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// --------------------API LOGIC------------------------------
async function makeApiRequest(userImageURL) {
  try {
    // Set the REPLICATE_API_TOKEN environment variable
    const REPLICATE_API_TOKEN = "r8_3JCpnj52PBgrY3nBNqLPyl4BfPmBYuH1AMA2A";
  
    // define the parameters for the API request eg what data to send to the API
    // created my own proxy server to bypass CORS error (cors-anywhere hosted on heroku)
    const APIEndpoint = "https://floating-oasis-76398-23ee924a082b.herokuapp.com/https://api.replicate.com/v1/predictions";
    const dataRequestObject = {
      version: "6af8583c541261472e92155d87bba80d5ad98461665802f2ba196ac099aaedc9",
      input: {
        image: userImageURL,
        width: 640,
        height: 640,
        prompt: "minimalist, very intricate colours, simplified continuous line colour drawing in the style of ink pen drawing by Michelangelo, white background, colours, heavy use of palette knives, only inky real colours on paper (colours)",
        guidance_scale: 5,
        negative_prompt: "(lowres, low quality, worst quality:1.2), (text:1.2), watermark, painting, drawing, illustration, glitch, deformed, mutated, cross-eyed, ugly, disfigured (lowres, low quality, worst quality:1.2), (text:1.2), watermark, painting, drawing, illustration, glitch,deformed, mutated, cross-eyed, ugly, disfigured, plain",
        ip_adapter_scale: 0.8,
        num_inference_steps: 30,
        controlnet_conditioning_scale: 0.8
        }
    }
    
    //make the API request using the fetch API and await response
    //fetch API takes request object and init (contains custom settings)
    const response = await fetch(APIEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Origin": "http://127.0.0.1:5500",  
        "X-Requested-With": "XMLHttpRequest"  
      },
      body: JSON.stringify(dataRequestObject),
      mode: 'cors'
    });
  
    // check if the response is ok
    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`); 
    }
  
    //parse data
    const data = await response.json();

    // Check if the prediction status is "succeeded"
    if (data.status === "succeeded" && data.output && data.output.length > 0) {
      // Access the output key to get the image URL
      const newImageURL = data.output[0];
      return newImageURL;
    } else {
      console.error('Prediction failed or no output image URL found.');
      return null;
    }
  
    } catch (e) {
      // handle any errors
      console.log(e);
    }
}

// --------------------Get Avatar----------------------------------
async function getAvatarImage() {
  try {
    const userImageInput = document.getElementById("userImage");

    // get the image file from the input element
    const selectedFile = userImageInput.files[0];

    const cloudinaryUrl = await addImage(selectedFile);
    console.log("Cloudinary URL:", cloudinaryUrl);

    // If a Cloudinary URL was successfully obtained, make the API request
    if (cloudinaryUrl) {
      const apiResponse = await makeApiRequest(cloudinaryUrl);
      console.log("API request made");
      // Do something with the API response if needed
      console.log("API response:", apiResponse);
    }
  } catch (error) {
    console.error("Error for getAvatarImage:", error);
  }
}