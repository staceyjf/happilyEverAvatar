const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');

let button = document.querySelector('.button');
let input = document.querySelector('input');

let file;

// button feature
button.onclick = () => {
  input.click();
};

// when browser button is clicked
input.addEventListener('change', () => {
  file = input.files[0];
  // console.log(file);

  dragArea.classList.add('active');

  displayFile()
});

//when file is inside the drag area
dragArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  dragText.textContent = 'Release to Upload';
  dragArea.classList.add('active');
  // console.log('File is inside the drag area');
});

// when file is outside the drag area
dragArea.addEventListener('dragleave', () => {
  dragText.textContent = 'Drag & Drop';
  dragArea.classList.remove('active');
  // console.log('File is outside the drag area');
});

// when file is dropped
dragArea.addEventListener('drop', (event) => {
  event.preventDefault(); // to provide the image from opening in another browser tab

  // select the file
  file = event.dataTransfer.files[0];
  // console.log(file);

  displayFile()

});

function displayFile() {
  let fileType = file.type;

  let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

  if (validExtensions.includes(fileType)) {
    // console.log('Valid file type');
    let fileReader = new FileReader();

    // when the file is read, convert it into a data url
    fileReader.onload = () => {
      // Retrieve the result, which is a data URL representing the file
      let fileURL = fileReader.result;
      // console.log(fileURL);
      let imgTag = `<img src="${fileURL}" alt="user's image" class="image">`;
      // replace with user's image
      dragArea.innerHTML = imgTag;
    };

    // read the file as a data URL
    fileReader.readAsDataURL(file);
  } else {
    alert('This is not a valid file type. Please upload an image file.');
    dragArea.classList.remove('active');
  }
}

