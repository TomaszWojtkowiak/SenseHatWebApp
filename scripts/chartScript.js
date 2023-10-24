const sampleTimeSec = 0.5; // sample time in sec
const sampleTimeMsec = 1000*sampleTimeSec; // sample time in msec
const maxSamplesNumber = 100; // maximum number of samples

var xdata; // x-axis labels array: time stamps
var ydata_r; // y-axis data array: roll values
var ydata_p; // y-axis data array: pitch values
var ydata_y; // y-axis data array: yaw values
var ydata_temp; // y-axis data array: temperature values
var ydata_press; // y-axis data array: pressure values
var ydata_hum; // y-axis data array: humidity values
var lastTimeStamp; // most recent time stamp 

var chartContext; // chart context (2D, 3D)
var chart; // Chart.js object

var activeSeries = "rpy";

var timer; // request timer

var infoBox = document.getElementById("infoBox");

function addData_r(y)
{
	if(ydata_r.length > maxSamplesNumber)
	{
		removeOldData("rpy");
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata_r.push(y);
	chart.update();
}

function addData_p(y)
{
	if(ydata_p.length > maxSamplesNumber)
	{
		removeOldData("rpy");
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata_p.push(y);
	chart.update();
}

function addData_y(y)
{
	if(ydata_y.length > maxSamplesNumber)
	{
		removeOldData("rpy");
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata_y.push(y);
	chart.update();
}

function addData_temp(y)
{
	if(ydata_temp.length > maxSamplesNumber)
	{
		removeOldData("temp");
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata_temp.push(y);
	chart.update();
}

function addData_press(y)
{
	if(ydata_press.length > maxSamplesNumber)
	{
		removeOldData("press");
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata_press.push(y);
	chart.update();
}

function addData_hum(y)
{
	if(ydata_hum.length > maxSamplesNumber)
	{
		removeOldData("hum");
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata_hum.push(y);
	chart.update();
}

function removeOldData(series)
{
	xdata.splice(0,1);
	if(series == "rpy")
	{
		ydata_r.splice(0,1);
		ydata_p.splice(0,1);
		ydata_y.splice(0,1);
	}
	else if(series == "temp")
		ydata_temp.splice(0,1);
	else if(series == "press")
		ydata_press.splice(0,1);
	else if(series == "hum")
		ydata_hum.splice(0,1);
}

function startTimer()
{
	timer = setInterval(ajaxJSON, sampleTimeMsec);
}

function stopTimer()
{
	clearInterval(timer);
}

function ajaxJSON() 
{
	var ip = document.getElementById("IP").value;
	var url = "http://" + ip + "/chartdata.json";
	$.ajax(url, 
	{
		type: 'GET', 
		dataType: 'json',
		timeout: 1000,
		success: function(responseJSON, status, xhr) 
		{
			if(activeSeries == "rpy")
			{
				addData_r(+responseJSON.roll);
				addData_p(+responseJSON.pitch);
				addData_y(+responseJSON.yaw);
			}
			else if(activeSeries == "temp")
				addData_temp(+responseJSON.temperature);
			else if(activeSeries == "press")
				addData_press(+responseJSON.pressure);
			else
				addData_hum(+responseJSON.humidity);
		},
		error: function(responseJSON, status, xhr)
		{
			infoBox.innerHTML = "FAILED TO ESTABLISH CONNECTION... CHECK IP...";
		}
	});
}

function chartInitRPY()
{
	// array with consecutive integers: <0, maxSamplesNumber-1>
	xdata = [...Array(maxSamplesNumber).keys()]; 
	// scaling all values ​​times the sample time 
	xdata.forEach(function(p, i) {this[i] = (this[i]*sampleTimeSec).toFixed(4);}, xdata);

	// last value of 'xdata'
	lastTimeStamp = +xdata[xdata.length-1]; 

	// empty arrays
	ydata_r = []; 
	ydata_p = []; 
	ydata_y = []; 

	// get chart context from 'canvas' element
	chartContext = $("#chart")[0].getContext('2d');

	chart = new Chart(chartContext, {
		// The type of chart: linear plot
		type: 'line',

		// Dataset: 'xdata' as labels, 'ydata' as dataset.data
		data: {
			labels: xdata,
			datasets: [{
				fill: false,
				label: 'Roll',
				backgroundColor: 'rgb(255, 0, 0)',
				borderColor: 'rgb(255, 0, 0)',
				data: ydata_r,
				lineTension: 0
			},
				{
				fill: false,
				label: 'Pitch',
				backgroundColor: 'rgb(0, 255, 0)',
				borderColor: 'rgb(0, 255, 0)',
				data: ydata_p,
				lineTension: 0
			},
				{
				fill: false,
				label: 'Yaw',
				backgroundColor: 'rgb(0, 0, 255)',
				borderColor: 'rgb(0, 0, 255)',
				data: ydata_y,
				lineTension: 0
			}]
		},

		// Configuration options
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Rotation [deg]'
					}
				}],
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Time [s]'
					}
				}]
			}
		}
	});
	
	ydata_r = chart.data.datasets[0].data;
	ydata_p = chart.data.datasets[1].data;
	ydata_y = chart.data.datasets[2].data;
	xdata = chart.data.labels;
	
	//$.ajaxSetup({ cache: false });
}

function chartInitTemp()
{
	// array with consecutive integers: <0, maxSamplesNumber-1>
	xdata = [...Array(maxSamplesNumber).keys()]; 
	// scaling all values ​​times the sample time 
	xdata.forEach(function(p, i) {this[i] = (this[i]*sampleTimeSec).toFixed(4);}, xdata);

	// last value of 'xdata'
	lastTimeStamp = +xdata[xdata.length-1]; 

	// empty arrays
	ydata_temp = [];

	// get chart context from 'canvas' element
	chartContext = $("#chart")[0].getContext('2d');

	chart = new Chart(chartContext, {
		// The type of chart: linear plot
		type: 'line',

		// Dataset: 'xdata' as labels, 'ydata' as dataset.data
		data: {
			labels: xdata,
			datasets: [{
				fill: false,
				label: 'Temperature',
				backgroundColor: 'rgb(255, 255, 0)',
				borderColor: 'rgb(255, 255, 0)',
				data: ydata_temp,
				lineTension: 0
			}]
		},

		// Configuration options
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
					labelString: 'Temperature [degC}'
					}
				}],
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Time [s]'
					}
				}]
			}
		}
	});
	
	ydata_temp = chart.data.datasets[0].data;
	xdata = chart.data.labels;
	
	//$.ajaxSetup({ cache: false });
}

function chartInitPress()
{
	// array with consecutive integers: <0, maxSamplesNumber-1>
	xdata = [...Array(maxSamplesNumber).keys()]; 
	// scaling all values ​​times the sample time 
	xdata.forEach(function(p, i) {this[i] = (this[i]*sampleTimeSec).toFixed(4);}, xdata);

	// last value of 'xdata'
	lastTimeStamp = +xdata[xdata.length-1]; 

	// empty arrays
	ydata_press = [];

	// get chart context from 'canvas' element
	chartContext = $("#chart")[0].getContext('2d');

	chart = new Chart(chartContext, {
		// The type of chart: linear plot
		type: 'line',

		// Dataset: 'xdata' as labels, 'ydata' as dataset.data
		data: {
			labels: xdata,
			datasets: [{
				fill: false,
				label: 'Pressure',
				backgroundColor: 'rgb(255, 0, 255)',
				borderColor: 'rgb(255, 0, 255)',
				data: ydata_press,
				lineTension: 0
			}]
		},

		// Configuration options
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Pressure [mBar]'
					}
				}],
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Time [s]'
					}
				}]
			}
		}
	});
	
	ydata_press = chart.data.datasets[0].data;
	xdata = chart.data.labels;
	
	//$.ajaxSetup({ cache: false });
}

function chartInitHum()
{
	// array with consecutive integers: <0, maxSamplesNumber-1>
	xdata = [...Array(maxSamplesNumber).keys()]; 
	// scaling all values ​​times the sample time 
	xdata.forEach(function(p, i) {this[i] = (this[i]*sampleTimeSec).toFixed(4);}, xdata);

	// last value of 'xdata'
	lastTimeStamp = +xdata[xdata.length-1]; 

	// empty arrays
	ydata_hum = [];

	// get chart context from 'canvas' element
	chartContext = $("#chart")[0].getContext('2d');

	chart = new Chart(chartContext, {
		// The type of chart: linear plot
		type: 'line',

		// Dataset: 'xdata' as labels, 'ydata' as dataset.data
		data: {
			labels: xdata,
			datasets: [{
				fill: false,
				label: 'Humidity',
				backgroundColor: 'rgb(0, 255, 255)',
				borderColor: 'rgb(0, 255, 255)',
				data: ydata_hum,
				lineTension: 0
			}]
		},

		// Configuration options
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Percent [%]'
					}
				}],
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Time [s]'
					}
				}]
			}
		}
	});
	
	ydata_hum = chart.data.datasets[0].data;
	xdata = chart.data.labels;
	
	//$.ajaxSetup({ cache: false });
}

function startChart()
{
	document.getElementById('start').disabled = true;
	document.getElementById('start').className = "menuButton buttonDisabled navButton";
	document.getElementById('stop').disabled = false;
	document.getElementById('stop').className = "menuButton navButton";
	startTimer();
}

function stopChart()
{
	document.getElementById('stop').disabled = true;
	document.getElementById('stop').className = "menuButton buttonDisabled navButton";
	document.getElementById('start').disabled = false;
	document.getElementById('start').className = "menuButton navButton";
	stopTimer();
}

function toggleRPY(condition)
{
	var rpy = document.getElementById('rpy');
	if(condition == "1")
	{
		rpy.disabled = false;
		rpy.className = "menuButton navButton";
	}
	else
	{
		rpy.disabled = true;
		rpy.className = "menuButton buttonDisabled navButton";
		toggleTemp(1);
		togglePress(1);
		toggleHum(1);
		ydata_temp = [];
		ydata_press = [];
		ydata_hum = [];
		stopChart();
		stopTimer();
		activeSeries = "rpy";
		chart.data.datasets = [];
		chartInitRPY();
		infoBox.innerHTML = "CURRENTLY GRABBING: ROLL; PITCH; YAW | DEGREES [deg]";
	}
}

function toggleTemp(condition)
{
	var temp = document.getElementById('temp');
	if(condition == "1")
	{
		temp.disabled = false;
		temp.className = "menuButton navButton";
	}
	else
	{
		temp.disabled = true;
		temp.className = "menuButton buttonDisabled navButton";
		toggleRPY(1);
		togglePress(1);
		toggleHum(1);
		ydata_r = [];
		ydata_p = [];
		ydata_y = [];
		ydata_press = [];
		ydata_hum = [];
		stopChart();
		stopTimer();
		activeSeries = "temp";
		chart.data.datasets = [];
		chartInitTemp();
		infoBox.innerHTML = "CURRENTLY GRABBING: TEMPERATURE | DEGREES CELSIUS [degC]";
	}
}

function togglePress(condition)
{
	var press = document.getElementById('press');
	if(condition == "1")
	{
		press.disabled = false;
		press.className = "menuButton navButton";
	}
	else
	{
		press.disabled = true;
		press.className = "menuButton buttonDisabled navButton";
		toggleTemp(1);
		toggleRPY(1);
		toggleHum(1);
		ydata_r = [];
		ydata_p = [];
		ydata_y = [];
		ydata_temp = [];
		ydata_hum = [];
		stopChart();
		stopTimer();
		activeSeries = "press";
		chart.data.datasets = [];
		chartInitPress();
		infoBox.innerHTML = "CURRENTLY GRABBING: PRESSURE | MILIBAR [mBar]";
	}
}

function toggleHum(condition)
{
	var hum = document.getElementById('hum');
	if(condition == "1")
	{
		hum.disabled = false;
		hum.className = "menuButton navButton";
	}
	else
	{
		hum.disabled = true;
		hum.className = "menuButton buttonDisabled navButton";
		toggleTemp(1);
		togglePress(1);
		toggleRPY(1);
		ydata_r = [];
		ydata_p = [];
		ydata_y = [];
		ydata_press = [];
		ydata_temp = [];
		stopChart();
		stopTimer();
		activeSeries = "hum";
		chart.data.datasets = [];
		chartInitHum();
		infoBox.innerHTML = "CURRENTLY GRABBING: HUMIDITY | PERCENT [%]";
	}
}

$(document).ready(() => { 
	chartInitRPY();
	toggleRPY(0);
	$("#sampletime").text(sampleTimeMsec.toString());
	$("#samplenumber").text(maxSamplesNumber.toString());
});
