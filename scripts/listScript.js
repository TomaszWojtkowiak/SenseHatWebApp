const grabData = ["r", "p", "y", "temperature", "pressure", "humidity", "left", "right", "up", "down", "mid"];

var isGrabbing = false;

var timer;

var infoBox = document.getElementById("infoBox");
var grabber = document.getElementById("grab");

function toggleData(id)
{
	var btn = document.getElementById(id);
	var data = document.getElementById(id + "P");
	if(data.style.display == "none")
	{
		data.style.display = "block";
		grabData.push(id);
		btn.className = "menuButton";
	}
	else
	{
		data.style.display = "none";
		btn.className = "menuButton buttonDisabled";
		removeData(id);
	}
}

function removeData(id)
{
	for(let i = 0; i < grabData.length; i++)
	{
		if(grabData[i] == id)
			grabData.splice(i,1);
	}
}

function toggleGrabbing()
{
	isGrabbing = !isGrabbing;
	if(isGrabbing)
	{
		grabber.className = "menuButton buttonDisabled";
		timer = setInterval(getData, 500);
		infoBox.innerHTML = "GRABBING...";
	}
	else
	{
		grabber.className = "menuButton";
		clearInterval(timer);
		infoBox.innerHTML = "READY TO GRAB...";
	}
		
}

function getData()
{
	var ip = document.getElementById("IP").value;
	var urlSensors = "http://" + ip + "/chartdata.json";
	var urlJoy = "http://" + ip + "/joydata.json";
	$.ajax(urlSensors, 
	{
		type: 'GET', 
		dataType: 'json',
		success: function(data, status, xhr) 
		{
			document.getElementById("rS").innerHTML = data.roll;
			document.getElementById("pS").innerHTML = data.pitch;
			document.getElementById("yS").innerHTML = data.yaw;
			document.getElementById("temperatureS").innerHTML = data.temperature;			
			document.getElementById("pressureS").innerHTML = data.pressure;
			document.getElementById("humidityS").innerHTML = data.humidity;
		},
		error: function(data, status, xhr)
		{
			infoBox.innerHTML = "FAILED TO ESTABLISH CONNECTION... CHECK IP...";
		}
	});
	$.ajax(urlJoy, 
	{
		type: 'GET', 
		dataType: 'json',
		success: function(data, status, xhr) 
		{
			document.getElementById("leftS").innerHTML = data.left;
			document.getElementById("rightS").innerHTML = data.right;
			document.getElementById("upS").innerHTML = data.up;
			document.getElementById("downS").innerHTML = data.down;
			document.getElementById("midS").innerHTML = data.mid;
		},
		error: function(responseJSON, status, xhr)
		{
			infoBox.innerHTML = "FAILED TO ESTABLISH CONNECTION... CHECK IP...";
		}
	});
}