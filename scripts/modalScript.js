var modal = document.getElementById("Modal");

function callModal()
{
	modal.style.display = "block";
}

function closeModal()
{
	modal.style.display = "none";
}

function savePrefs()
{
	var ip = document.getElementById('IP').value;
	var urlAddress = "http://" + ip + "/createSettingsFile.php?id=" + ip;
	$.ajax
		({
			url: urlAddress,
			timeout: 1000,
			success: function(data)
			{
				document.getElementById('errorText').innerHTML = "";
				closeModal();
			},
			error: function(data, error)
			{
				document.getElementById('errorText').innerHTML = "FAILED TO ESTABLISH CONNECTION... CHECK IP...";
			}
		})
}