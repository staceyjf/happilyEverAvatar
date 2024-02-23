// using the locale settings of the browser
function getTodaysDate() {
  const currentDate = new Date();
  const formatOptions = { month: 'short', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(undefined, formatOptions);

  document.getElementById('currentDate').innerHTML = formattedDate;
}

getTodaysDate();
