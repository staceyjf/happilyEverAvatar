// footer logic for date
function getTodaysDate() {
  const currentDate = new Date();
  const formatOptions = { month: 'short', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(undefined, formatOptions);

  document.getElementById('currentDate').innerHTML = formattedDate;
}

getTodaysDate();

function reset() {
  
  // replacing the userImage placeholder with the original content
  const newHTML = `
  <div class="icon">
  <i class="fa-solid fa-file-arrow-up"></i>
  </div>
  
  <span class="header">Drag & Drop</span>
  <span class="header">or <span class="button" id="browser-button">browse</span> </span>
  <!-- accept attribute to only allow image files -->
  <input type="file" hidden>
  <span class="support">Supports: JPEG, JPG, PNG</span>
  `;
  const dragArea = document.querySelector('.drag-area');
  dragArea.classList.remove('active');
  dragArea.innerHTML = newHTML;
  
  // Reattach the event listener to the new browserButton element
  const browserButton = document.getElementById('browser-button');
  browserButton.onclick = () => {
    input.click();
  };

console.log("Content replaced");
}