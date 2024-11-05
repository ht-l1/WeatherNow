function fetchWeatherData(dataType, elementId) {
  // Get the user's location
  navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Make the API request
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=${dataType}`)
      .then(response => response.json())
      .then(data => {
        const value = data.hourly[dataType][0];
        const unit = dataType === 'temperature_2m' ? '°C' : 'm/s';

        // Display the data
        document.getElementById(elementId).innerHTML = `${dataType === 'temperature_2m' ? 'Temperature' : 'Wind Speed'}: ${value} ${unit}`;
      })
      .catch(error => {
        console.error("Error fetching weather data: ", error);
      });
  });
}


// theme toggle
document.getElementById('theme-toggler').addEventListener('click', function () {
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');

  if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-regular', 'fa-sun');
    themeIcon.classList.add('fa-regular', 'fa-moon');
  } else {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    themeIcon.classList.remove('fa-regular', 'fa-moon');
    themeIcon.classList.add('fa-regular', 'fa-sun');
  }
});
