/*=============================*/
//	Document ready
/*=============================*/

$( document ).ready(function() {
   
	getBuckets();	
	AWS.config.update({accessKeyId: 'AKIAI62PVLEIDCVMJPKQ', secretAccessKey: '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'});
	AWS.config.region = 'eu-central-1';
	s3 = new AWS.S3;



});


/*=============================*/
//	UI Actions
/*=============================*/

//	Admin page actions
/*-----------------------------*/

function getUrl(){

	/*
	Faire un tableau de correspondance entre une clé générée dynamiquement
	et le nom des fichiers des utilisateurs pour que le tout soit hyper dynamique
	TODO: Générer un bucket en Python
	*/

	var expires_in_seconds = 3600;
	var key = 'targetLol.txt' // TODO: rendre ça dynamique, il faudra mettre dans la var?
	var presignedUrl = 'none'
	var params = {Bucket: 'bucketmanual-fred', Key: key, Expires: expires_in_seconds};

	// Get the presigned url
	s3.getSignedUrl('putObject', params, function (err, url) {
	  presignedUrl = url;
	});

	localStorage.setItem("presignedUrl", presignedUrl);
	
	var data = {
	    "expires_in_seconds": expires_in_seconds,
	    "url": presignedUrl,
	    "status": "empty"
	}

	// For testing
	//
	// var data = {
	//     "expires_in_seconds": expires_in_seconds,
	//     "url": "http://www.google.com",
	//     "status": "empty"
	// }

	$.ajax({
	  url: presignedUrl,
	  type: 'PUT',
	  data: 'data to upload into URL',
	  success: function(result) { 
	  	console.log(result); 
	  }
	});

	// Create the db entry
	$.post('/api/buckets/', data, function(result) {
		var id = result.id
	    var created = new Date(result.created);
    	var expires_in_seconds = result.expires_in_seconds;
    	var expiration_date = new Date(created.getTime()+result.expires_in_seconds*1000);
    	var url = result.url;
    	var status = result.status;
    	addRow(id, expiration_date, status, url);
	});
}

function uploadLink(id){
	$.getJSON( "/api/buckets/"+id, function( data ) {
	  	alert(data.url);
	});
}

function downloadFile(){
	console.log("downloadFile");
}

function deleteUrl(id){
 	$.ajax({
    url: '/api/buckets/'+id,
    type: 'DELETE',
    success: function(result) {
	    	removeRow(id);
    	}
	});
}

//	Bucket page actions
/*-----------------------------*/

function upload(){

	//Il faut passe le presignedUrl en GET dans le lien qu'on va donner, ou faire un attribut dans la bd
	var presignedUrl = localStorage.getItem("presignedUrl");

	$.ajax({
	  url: presignedUrl,
	  type: 'PUT',
	  data: 'data to upload into URL',
	  success: function(result) { 
	  	console.log(result); 
	  }
	});
	
}


/*=============================*/
//	Functions
/*=============================*/

//	AWS Function
/*-----------------------------*/

function listObjects(){
	var params = {Bucket: 'bucketmanual-fred'};
	s3.listObjects(function (err, data) {
    if (err) {
        console.log('Could not load objects from S3');
    } else {
      console.log('Loaded ' + data.Contents.length + ' items from S3');

      for (var i = 0; i < data.Contents.length; i++) {
        console.log(data.Contents[i].Key);
      }
    }
  });
}


//	Fily functions
/*-----------------------------*/

/**
* Get the buckets from the API
*/
function getBuckets{
	$.getJSON( "/api/buckets", function( data ) {
	  $.each(data, function(i,value){
	  		var id = value.id;
        	var created = new Date(value.created);
        	var expires_in_seconds = value.expires_in_seconds;
        	var expiration_date = new Date(created.getTime()+value.expires_in_seconds*1000);
        	var url = value.url;
        	var status = value.status;
        	addRow(id, expiration_date, status, url);
        });
	});
}

function getBucketCors() {
	console.log('Getting CORS');
	var params = {Bucket: 'bucketmanual-fred'};
	s3.getBucketCors(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
}

function getBucketFile() {
	var params = {Bucket: 'bucketmanual-fred', Key: 'target.txt'};
	var url = s3.getSignedUrl('getObject', params);
	console.log(url);
}

function putBucketFile() {
	var params = {Bucket: 'bucketmanual-fred', Key: 'target.txt'};
	var url = s3.getSignedUrl('getObject', params);
	console.log(url);
}

function addRow(id, expiration_date, status, url){
  	$(".table").append('<tr id="bucket-'+id+'">\
			<td>'+expiration_date+'</td>\
            <td>'+status+'</td>\
            <td>\
            	<button onclick="uploadLink('+id+')" type="button" class="btn btn-default btn-xs">Upload link</button>\
            </td>\
			<td>\
				<button onclick="downloadFile()" type="button" class="btn btn-default btn-xs">Download file</button>\
				<button onclick="deleteUrl('+id+')" type="button" class="btn btn-default btn-xs">Delete</button>\
			</td>\
		</tr>');
}

function removeRow(id){
	$('#bucket-'+id).remove();
}


