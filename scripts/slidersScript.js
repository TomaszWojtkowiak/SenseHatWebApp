var sliderR = document.getElementById("redSlider");
var sliderG = document.getElementById("greenSlider");
var sliderB = document.getElementById("blueSlider");
var output = document.getElementById("RGBtext");
var block = document.getElementById("colorBox");


sliderR.oninput = function()
{
	var colorText = "RGB: (" + sliderR.value + "," + sliderG.value + "," + sliderB.value + ")";
	output.innerHTML = colorText;
	colorText = "rgb(" + sliderR.value + "," + sliderG.value + "," + sliderB.value + ")";
	block.style.backgroundColor = colorText;
}

sliderG.oninput = function()
{
	var colorText = "RGB: (" + sliderR.value + "," + sliderG.value + "," + sliderB.value + ")";
	output.innerHTML = colorText;
	colorText = "rgb(" + sliderR.value + "," + sliderG.value + "," + sliderB.value + ")";
	block.style.backgroundColor = colorText;
}

sliderB.oninput = function()
{
	var colorText = "RGB: (" + sliderR.value + "," + sliderG.value + "," + sliderB.value + ")";
	output.innerHTML = colorText;
	colorText = "rgb(" + sliderR.value + "," + sliderG.value + "," + sliderB.value + ")";
	block.style.backgroundColor = colorText;
}