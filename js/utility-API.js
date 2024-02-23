  try {
  // Set the REPLICATE_API_TOKEN environment variable
  const REPLICATE_API_TOKEN = "r8_azjEd7HXV71fZJ21keIFSqDH6gQwMC737FO6a";

  // define the parameters for the API request eg what data to send to the API
  const APIEndpoint = "https://api.replicate.com/v1/predictions";
  const dataRequestObject = {
    version: "965db2664428311c75f49036a8ff261e1972ac714efd7d7a1c15c808db021b0e",
    input: {
      image: "https://replicate.delivery/pbxt/KGyS43owe6zh6PpqA2BDoIbPrFy6ef2BOEHvi4nuj5yE2VSq/yann-lecun_resize.jpg",
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

  } catch (e) {
    // handle any errors
    console.log(e);
  }

