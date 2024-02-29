// footer logic for date
function getTodaysDate() {
  const currentDate = new Date();
  const formatOptions = { month: 'short', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(undefined, formatOptions);

  document.getElementById('currentDate').innerHTML = formattedDate;
}

getTodaysDate();