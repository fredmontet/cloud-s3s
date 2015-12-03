/*=============================*/
//	Document ready
/*=============================*/

$( document ).ready(function() {
	getBuckets();	
	AWS.config.update({accessKeyId: 'AKIAJUR2T2KVHZP47YEA', secretAccessKey: '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'});
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
	var bucket_name = 'bucketmanual';
	var key = 'target2.txt' // TODO: rendre ça dynamique, il faudra mettre dans la var?
	var url_up = 'none';
	var url_down = 'none';
	var params = {Bucket: bucket_name, Key: key, Expires: expires_in_seconds};

	// Get the presigned url to upload file
	s3.getSignedUrl('putObject', params, function (err, url) {
	  url_up = url;
	});

	console.log('The URL to upload is', url_up);

	// Temporary to test
	localStorage.setItem("url_up", url_up);

	// Get the presigned url to download file
	var url_down = s3.getSignedUrl('getObject', params);

	console.log('The URL to download is', url_down);

	var data = {
	    "expires_in_seconds": expires_in_seconds,
	    "url_up": url_up,
	    "url_down": url_down,
	    "status": "empty"
	}

/*
	// Upload to S3
	$.ajax({
	  url: url_up,
	  type: 'PUT',
	  data: 'data to upload into URL',
	  success: function(result) { 
	  	console.log(result); 
	  }
	});
*/
	// Create the db entry
	$.post('/api/buckets/', data, function(result) {
		var id = result.id
	    var created = new Date(result.created);
    	var expires_in_seconds = result.expires_in_seconds;
    	var expiration_date = new Date(created.getTime()+result.expires_in_seconds*1000);
    	var url_up = result.url_up;
    	var url_down = result.url_down;
    	var status = result.status;
    	addRow(id, expiration_date, status, url_up, url_down);
	});
}

function uploadLink(id){
	$.getJSON( "/api/buckets/"+id, function( data ) {
	  	alert(window.location.href+"bucket?uuid="+data.uuid);
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

//TODO url_up is not define here
function upload(){

	// Temporary to test
	var url_up = localStorage.getItem("url_up");
	console.log("upload: ", url_up); 

	$.ajax({
	  url: url_up,
	  type: 'PUT',
	  data: 'data to upload into URL',
	  success: function(result) { 
	  	console.log(result); 
	  }
	});

	//TODO ajax to change the status of the link in admin


}


/*=============================*/
//	Functions
/*=============================*/

//	AWS Function
/*-----------------------------*/

function listObjects(){
	var params = {Bucket: bucket_name};
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
function getBuckets(){
	$.getJSON( "/api/buckets", function( data ) {
	  $.each(data, function(i,value){
	  		var id = value.id;
        	var created = new Date(value.created);
        	var expires_in_seconds = value.expires_in_seconds;
        	var expiration_date = new Date(created.getTime()+value.expires_in_seconds*1000);
        	var url_up = value.url;
        	var url_down = value.url_down;
        	var status = value.status;
        	addRow(id, expiration_date, status, url_up, url_down);
        });
	});
}

function getBucketCors() {
	console.log('Getting CORS');
	var params = {Bucket: bucket_name};
	s3.getBucketCors(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
}

function getBucketFile() {
	var params = {Bucket: bucket_name, Key: 'target.txt'};
	var url = s3.getSignedUrl('getObject', params);
	console.log(url);
}

function putBucketFile() {
	var params = {Bucket: bucket_name, Key: 'target.txt'};
	var url = s3.getSignedUrl('getObject', params);
	console.log(url);
}

function addRow(id, expiration_date, status, url_up, url_down){

  	$(".table").append('<tr id="bucket-'+id+'">\
			<td>'+expiration_date+'</td>\
            <td>'+status+'</td>\
            <td>\
            <button onclick="uploadLink('+id+')" type="button" class="btn btn-default btn-xs">Upload link</button>\
            </td>\
			<td>\
			<a href="'+url_down+'"><button onclick="downloadFile()" type="button" class="btn btn-default btn-xs">Download file</button></a>\
			<button onclick="deleteUrl('+id+')" data-bucket-id="'+id+'" type="button" class="btn btn-default btn-xs">Delete</button>\
			</td>\
		</tr>');
}

function removeRow(id){
	$('#bucket-'+id).remove();
}


