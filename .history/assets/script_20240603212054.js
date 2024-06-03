// bieu do
let data = {
  labels: Array(10).fill('Time'),
  datasets: [{
    label: 'Nhiệt độ',
    data: Array(10).fill(0),
    borderColor: '#65e48c',
    backgroundColor: '#65e48c',
    yAxisID: 'y',
    xAxisID: 'x'
  }, {
    label: 'Độ ẩm',
    data: Array(10).fill(0),
    borderColor: '#3a98f1',
    backgroundColor: '#3a98f1',
    yAxisID: 'y',
    xAxisID: 'x'
  }, {
    label: 'Ánh sáng',
    data: Array(10).fill(0),
    borderColor: '#f1e500',
    backgroundColor: '#f1e500',
    yAxisID: 'y2',
    xAxisID: 'x',
    type: 'line'
  }]
};

const config = {
  type: 'scatter',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      // title: {
      //   display: true,
      //   text: 'Chart.js Scatter Multi Axis Chart'
      // }
    },
    scales: {
      x: {
        type: 'category',
        position: 'bottom',
      },
      y: {
        type: 'linear',
        position: 'left',
        max: 100,
        ticks: {
          color: 'black'
        }
      },
      y2: {
        type: 'linear',
        position: 'right',
        max: 4100,
        ticks: {
          color: 'black'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  },
};

const ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, config);

async function fetchSensorData() {
    const response = await fetch('http://localhost:5003/');
    if (!response.ok) {
        console.error('Error', response.statusText);
        return;
    }

    const getdata = await response.json();
    let data_15 = getdata.data;
    let lastData = data_15[data_15.length - 1];

    document.querySelector('.envirTemp').innerText = lastData.temperature + '';
    document.querySelector('.envirHum').innerText = lastData.humidity + '';
    document.querySelector('.envirLux').innerText = lastData.luminosity + '';
                                                          // -> light if api of Nhung
    // temperature
    var envirItem = document.querySelector('.envirItem');
    var envirTemp = document.querySelector('.envirTemp');
    var temperature = parseInt(envirTemp.innerHTML);
    changeBackgroundColorTemp(temperature);
    // Hàm để đổi màu nền dựa trên nhiệt độ
    function changeBackgroundColorTemp(temp) {
        var gradientColor;
        if (temp < 15) {
            gradientColor = 'linear-gradient(45deg, #f9a7a9, #ff7878)'; 
        } else if (temp >= 15 && temp < 25) {
            gradientColor = 'linear-gradient(45deg, #ff7878, #f2302f)'; 
        } else {
            gradientColor = 'linear-gradient(45deg, #f2302f, #a50405)';
        }
        envirItem.style.background = gradientColor;
    };
    
    // humidity
    var envirItem1 = document.querySelector('.envirItem1');
    var envirHum = document.querySelector('.envirHum');
    var humidity = parseInt(envirHum.innerHTML);
    changeBackgroundColorHum(humidity);
    // Hàm để đổi màu nền dựa trên độ ẩmøø
    function changeBackgroundColorHum(hum) {
        var gradientColor;
        if (hum < 40) {
            gradientColor = 'linear-gradient(45deg,  #7ce8ff, #55d0ff)'; 
        } else if (hum >= 40 && hum <= 70) {
            gradientColor = 'linear-gradient(45deg,  #55d0ff,#0058b3)'; 
        } else {
            gradientColor = 'linear-gradient(45deg, #00acdf,#003366)'; 
        }
        envirItem1.style.background = gradientColor;
    };

    // light
    var envirItem2 = document.querySelector('.envirItem2');
    var envirLux = document.querySelector('.envirLux');
    var light = parseInt(envirLux.innerHTML);

    changeBackgroundColorLight(light);
    // Hàm để đổi màu nền dựa trên nhiệt độ
    function changeBackgroundColorLight(lg) {
        var gradientColor;
        if (lg < 50) {
            gradientColor = 'linear-gradient(-30deg, #535200, #8D8C00)'; // Màu xanh dương
        } else if (lg >= 50 && lg <= 700) {
            gradientColor = 'linear-gradient(-30deg, #FFD400, #EDEA00)'; // Màu xanh da trời nhạt
        } else {
            gradientColor = 'linear-gradient(-30deg, #EDEA00, #F6FA67)'; // Màu đỏ
        }
        envirItem2.style.background = gradientColor;
    };


    data.datasets[0].data.shift();
    data.datasets[0].data.push(lastData.temperature);

    data.datasets[1].data.shift();
    data.datasets[1].data.push(lastData.humidity);

    data.datasets[2].data.shift();
    data.datasets[2].data.push(lastData.luminosity);

    // data.labels.shift();
    // data.labels.push(lastData.dateCreated);

    myChart.update();

};

document.addEventListener('DOMContentLoaded', (event) => {
    setInterval(fetchSensorData, 5000);
    fetchSensorData();
});

// Bat tat den
document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const lamp = document.getElementById('lamp');

    toggleSwitch.addEventListener('change', function () {
        if (toggleSwitch.checked) {
            lamp.style.backgroundImage = "url('assets/images/lightOn.png')";
        } else {
            lamp.style.backgroundImage = "url('assets/images/lightOff.png')";
        }
    });
});

// Bat tat quat
document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggleSwitchFan');
    const fan = document.getElementById('fan');

    toggleSwitch.addEventListener('change', function () {
        if (toggleSwitch.checked) {
            fan.style.backgroundImage = "url('assets/images/fanOn.gif')";
        } else {
            fan.style.backgroundImage = "url('assets/images/fanOff.gif')";
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        showContent(activeTab);
        var activeLink = document.querySelector('ul li a[href="#"][onclick="showContent(\'' + activeTab + '\', this)"]');
        if (activeLink) {
            showContent(activeTab, activeLink);
        }
    }
});

function showContent(page, clickedElement) {
    var contents = document.querySelectorAll('.tabContent');
    contents.forEach(function(content) {
        content.style.display = 'none';
    });
    document.getElementById(page).style.display = 'block';

    localStorage.setItem('activeTab', page);

    var links = document.querySelectorAll('ul li a');
    links.forEach(function(link) {
        link.style.fontWeight = 'normal';
    });

    clickedElement.style.fontWeight = 'bold';
};

window.addEventListener('DOMContentLoaded', (event) => {
    showContent('wrapper', this);
});
