// --------------------Global Variables-----------------------
const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');
const showLoadingWheel = document.getElementById('loadingOverlay');
const processingStatus = document.getElementById('box-status');
let browserButton = document.getElementById('browser-button');
let input = document.querySelector('input');

let file;
let fileURL;

// --------------------Event Listeners-----------------------
// --------------------Browse LOGIC-----------------------
// browse 'button' feature
browserButton.onclick = () => {
  input.click();
};

// when file is added, process file
input.addEventListener('change', async () => {
  file = input.files[0]; // select the file
  dragArea.classList.add('active');
  uploadImage(file);
  processingStatus.innerText = "File selected. Click 'Upload to AI' to process your image.";
});

// --------------------Drag & Drop LOGIC-----------------------
//when file is inside the drag area
dragArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  dragText.textContent = 'Release to Upload';
  dragArea.classList.add('active');
});

// when file is outside the drag area
dragArea.addEventListener('dragleave', () => {
  dragText.textContent = 'Drag & Drop';
  dragArea.classList.remove('active');
});

// when file is dropped
dragArea.addEventListener('drop', async (event) => {
  event.preventDefault(); // to provide the image from opening in another browser tab
  file = event.dataTransfer.files[0];

  // need to change it to a Binary Large Object to ensure the API receives a consistent format as file input can vary from browser to browser
  const blob = new Blob([file], { type: file.type });
  uploadImage(blob);
  processingStatus.innerText = "File selected. Click 'Upload to AI' ";
});



// --------------------File processing LOGIC-----------------------
function processFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected.'));
      return;
    }

    let fileType = file.type;
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

    if (validExtensions.includes(fileType)) {
      console.log('Valid file type');

      let fileReader = new FileReader();
      // when the file is read, convert it into a data URL
      fileReader.onload = () => {
        // Retrieve the result, which is a data URL representing the file and update the global fileURL variable
        fileURL = fileReader.result;
        console.log('File URL:', fileURL);
        resolve(fileURL);
      };

      // read the file as a data URL
      fileReader.readAsDataURL(file);

    } else {
      reject(new Error('Invalid file type. Please upload an image file.'));
      dragArea.classList.remove('active');
    }
  });
}

// --------------------API LOGIC------------------------------
async function makeApiRequest(userImageURL) {
  try {
    // Set the REPLICATE_API_TOKEN environment variable
    const REPLICATE_API_TOKEN = "r8_3JCpnj52PBgrY3nBNqLPyl4BfPmBYuH1AMA2A";

    let userPrompt;

    // the user's artistic prompt choice
    const selectedStyle = document.querySelector('.user-prompt input[name="user-prompt"]:checked').value;
    console.log("User's choice:", selectedStyle);

    //user prompts
    if (selectedStyle === "minimalist") {
      userPrompt = "minimalist, very intricate colours, simplified continuous line colour drawing in the style of ink pen drawing by Michelangelo, white background, colours, heavy use of palette knives, only inky real colours on paper (colours)";
    } else if (selectedStyle === "impressionist") {
      userPrompt = "impressionist painting, capturing the essence of brushstrokes and color blending. Apply a painterly effect that emulates the style of artists like Monet or Van Gogh. Focus on creating a vibrant and textured appearance";
    } else if (selectedStyle === "disney") {
      userPrompt = "animated princess look in the style of Disney's Elsa of Frozen. Colours should be bright and playful."
    };
  

    console.log("User's prompt:", userPrompt);

    // define the parameters for the API request eg what data to send to the API
    // created my own proxy server to bypass CORS error (cors-anywhere hosted on heroku)
    const APIEndpoint = "https://floating-oasis-76398-23ee924a082b.herokuapp.com/https://api.replicate.com/v1/predictions";
    const dataRequestObject = {
      version: "6af8583c541261472e92155d87bba80d5ad98461665802f2ba196ac099aaedc9",
      input: {
        image: userImageURL,
        width: 640,
        height: 640,
        prompt: userPrompt,
        guidance_scale: 5,
        negative_prompt: "(lowres, low quality, worst quality:1.2), (text:1.2), watermark, glitch, deformed, mutated, cross-eyed, ugly, disfigured,plain",
        ip_adapter_scale: 0.8,
        num_inference_steps: 30,
        controlnet_conditioning_scale: 0.8
        }
    }

    console.log("dataRequestObject:", dataRequestObject);
    
    //make the API request using the fetch API and await response / fetch API takes request object and init (contains custom settings)
    const response = await fetch(APIEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(dataRequestObject),
      mode: 'cors',
    });

    const data = await response.json();

    // Check if the prediction status is "succeeded"
    if (data.status === "succeeded" && data.output && data.output.length > 0) {
      const newImageURL = data.output[0];
      return newImageURL;
    } else if (data.status === "starting" || data.status === "processing") {
      // If still processing, initiate polling
      const predictionId = data.id;
      const resultUrl = `${APIEndpoint}/${predictionId}`; // Use the provided "get" URL

      // Polling loop
      const maxAttempts = 100; 
      let attempt = 0;
      let resultData;

      while (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 4000)); // Wait 2 seconds between attempts

        const resultResponse = await fetch(resultUrl, {
          headers: {
            "Authorization": `Token ${REPLICATE_API_TOKEN}`,
          },
        });

        resultData = await resultResponse.json();

        processingStatus.innerText = "Instant-ID is working hard to process your image...";

        if (resultData.status === "succeeded" && resultData.output && resultData.output.length > 0) {
          return resultData.output[0]; //this is the URL of the generated image
        } else if (resultData.status === "failed") {
          console.error('Prediction failed.');
          return null;
        }

        attempt++;
      }

      console.error('Prediction took too long or failed.');
      return null;
    } else {
      console.error('Prediction failed or no output image URL found.');
      return null;
    }
  } catch (e) {
    console.error('Error in makeApiRequest:', e);
    return null;
  }
}

// --------------------Display original image----------------------------------
async function uploadImage(file) {
  try {
    const processImageURL = await processFile(file);
    console.log("processImageURL:", processImageURL);

    if (processImageURL) {
      // add the display image into the dragArea
      let imgTag = `<img src="${processImageURL}" alt="user's image" class="image">`;
      dragArea.innerHTML = imgTag;
      console.log("placeholder updated with image");
    }    
  } catch (error) {
    console.error("Error for getAvatarImage:", error);
     // update status message
     processingStatus.innerText = "Oh no! Something went wrong. Please try again.";
  }
}

// --------------------Get & display Avatar----------------------------------
async function getAvatarImage(fileURL) {
  try {
    const userImageOutput = document.getElementById("generatedImage");
    const inputButton = document.getElementById("AI-input-button");
    const resetButton = document.getElementById("reset-button");
   
    console.log("fileURL:", fileURL);

    if (fileURL) {
      // status update
      processingStatus.innerText = "Instant-ID is processing your image...";
      inputButton.disabled = true;
      showLoadingWheel.style.display = "flex"
      
      // image url to Instant-ID image
      console.log("API request made");
      const apiResponse = await makeApiRequest(fileURL);
      console.log("API response:", apiResponse);

      // updated the image placeholder with image
      userImageOutput.style.backgroundImage = `url('${apiResponse}')`;
  
      // update status message
      processingStatus.innerText = "Success! Your image has been processed.";
      showLoadingWheel.style.display = "none";
      inputButton.disabled = false;
      resetButton.style.display = "flex";
    }
  } catch (error) {
    console.error("Error for getAvatarImage:", error);
     // update status message
     processingStatus.innerText = "Oh no! Something went wrong. Please try again.";
     inputButton.disabled = false;
     resetButton.style.display = "flex";
  }
}


