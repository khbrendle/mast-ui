<script>
	let uploadStatus = "";
	$: uploadStatus = uploadStatus;

	function handleSubmit(e) {
	  var oData = new FormData(e.target);

	  oData.append("CustomField", "This is some extra data");

	  var oReq = new XMLHttpRequest();
	  oReq.open("POST", "http://localhost:3000/v0/upload", true);
	  oReq.onload = function(oEvent) {
	    if (oReq.status == 200) {
	      uploadStatus = "Uploaded!";
	    } else {
	      uploadStatus =
	        "Error " + oReq.status + " occurred when trying to upload your file.";
	    }
	  };

	  oReq.send(oData);
	}
</script>

<form enctype="multipart/form-data" method="POST" name="fileinfo" on:submit|preventDefault={handleSubmit}>
	<input id="file-input" type="file" name="file" required >
	<input type="submit" value="send the file">
</form>
<div>
{uploadStatus}
</div>
