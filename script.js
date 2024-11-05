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

// chart

let chart;

async function fetchHistoricalData(days) {
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  
  const today = new Date();
  const pastDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
  
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${pastDate.toISOString().split('T')[0]}&end_date=${today.toISOString().split('T')[0]}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
  
  return await response.json();
}

async function updateChart(days) {
  const data = await fetchHistoricalData(days);
  const dates = data.daily.time;
  const maxTemps = data.daily.temperature_2m_max;
  const minTemps = data.daily.temperature_2m_min;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(document.getElementById('temperatureChart'), {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Max Temperature',
          data: maxTemps,
          borderColor: '#FF6B6B',
          fill: false
        },
        {
          label: 'Min Temperature',
          data: minTemps,
          borderColor: '#4ECDC4',
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Temperature Trend'
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,  // enable the use of point style in the legend
            pointStyle: 'dash' }}}
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.time-button').forEach(button => {
    button.addEventListener('click', () => {
      const days = parseInt(button.dataset.days);
      updateChart(days);
    });
  });

  // Initial chart load
  updateChart(7);
});
