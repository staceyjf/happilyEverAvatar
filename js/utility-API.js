// --------------------IMAGE FILE LOGIC----------------------------------
async function addImage(input) {
  const formData = new FormData();
  formData.append('file', input.files[0]); // use the the forms input to source the image file
  formData.append('upload_preset', 'flatironfinder');

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/my_cloud_name/image/upload", {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const result = await response.json();
    const cloudinaryUrl = result.url;

    return cloudinaryUrl;

  } catch (error) {
    console.error("Error in addImage:", error);
  }
}

// --------------------API LOGIC------------------------------
async function makeApiRequest(userImageURL) {
  try {
    // Set the REPLICATE_API_TOKEN environment variable
    const REPLICATE_API_TOKEN = "r8_azjEd7HXV71fZJ21keIFSqDH6gQwMC737FO6a";
  
    // define the parameters for the API request eg what data to send to the API
    const APIEndpoint = "https://api.replicate.com/v1/predictions";
    const dataRequestObject = {
      version: "965db2664428311c75f49036a8ff261e1972ac714efd7d7a1c15c808db021b0e",
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
        "Content-Type": "application/json",
        "Authorization": `Bearer ${REPLICATE_API_TOKEN}`
      },
      body: JSON.stringify(dataRequestObject)
    });
  
    // check if the response is ok
    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`); 
    }
  
    //parse data
    const data = await response.json();

    return data
  
    } catch (e) {
      // handle any errors
      console.log(e);
    }
}

// --------------------Get Avatar----------------------------------
async function getAvatarImage() {
  try {
    // Assuming 'userImageInput' is the actual input element where the user selects the image
    const userImageInput = document.getElementById("userImage");

    // Get the Cloudinary URL from the uploaded image
    const cloudinaryUrl = await addImage(userImageInput);

    console.log("Cloudinary URL:", cloudinaryUrl);

    // If a Cloudinary URL was obtained, make the API request
    if (cloudinaryUrl) {
      console.log("Cloudinary URL has been obtained");
      const apiResponse = await makeApiRequest(cloudinaryUrl);
      console.log("API request has been made");
      // Do something with the API response if needed
      console.log("API response:", apiResponse);
    }
  } catch (error) {
    console.error("Error in getAvatarImage:", error);
  }
}