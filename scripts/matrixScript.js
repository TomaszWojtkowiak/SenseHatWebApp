const arrayOfLeds = new Array();
const legacy_arrayOfLeds = new Array();
var sliderR = document.getElementById('redslider');
var sliderG = document.getElementById('greenslider');
var sliderB = document.getElementById('blueslider');
var legacy_sliderR = sliderR;
var legacy_sliderG = sliderG;
var legacy_sliderB = sliderB;

function getLEDParams(ID)
{
	var LED = document.getElementById(ID);
	if(LED.style.borderWidth == "10px")
	{
		LED.style.borderWidth = "1px";
		for(let i = 0; i < arrayOfLeds.length; i++)
		{
			if(arrayOfLeds[i].id == LED.id)
				arrayOfLeds.splice(i,1);
		}
	}
	else
	{
		LED.style.borderWidth = "10px";
		arrayOfLeds.push(LED);
	}
	if(arrayOfLeds != legacy_arrayOfLeds)
		document.getElementById('debug').innerHTML = "CHANGES HAVE BEEN MADE SINCE LAST EXECUTION... PRESS THE 'LIGHT' BUTTON TO EXECUTE THEM...";
	else
		document.getElementById('debug').innerHTML = "AWAITING NEW COMMANDS...";
}

function sendData()
{
	var ip = document.getElementById('IP').value;
	var r = sliderR.value;
	var g = sliderG.value;
	var b = sliderB.value;
	if(arrayOfLeds.length == 0)
	{
		document.getElementById('debug').innerHTML = "NO LEDS TO LIGHT... CHECK YOUR ENTRIES...";
		return; 
	}
		
	for(let i = 0; i < arrayOfLeds.length; i++)
	{
		var xpos = Math.floor(arrayOfLeds[i].id / 10);
		var ypos = arrayOfLeds[i].id % 10;
		var urlAddress = "http://" + ip + "/colorCommand.php?x="+xpos+"&y="+ypos+"&r="+r+"&g="+g+"&b="+b;
		
		$.ajax
		({
			url: urlAddress,
			timeout: 1000,
			success: function(data)
			{
				document.getElementById('debug').innerHTML = "COMMAND PROCESSED... CHECK SENSEHAT...";
				if(r<60 && g<60 && b<60)
					arrayOfLeds[i].style.backgroundColor = "rgb(200,200,200)";
				else
					arrayOfLeds[i].style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
			},
			error: function(data, error)
			{
				document.getElementById('debug').innerHTML = "FAILED TO ESTABLISH CONNECTION... CHECK IP..."
			}
		})
	}
	legacy_arrayOfLeds = arrayOfLeds;
	legacy_sliderR = sliderR;
	legacy_sliderG = sliderG;
	legacy_sliderB = sliderB;
}