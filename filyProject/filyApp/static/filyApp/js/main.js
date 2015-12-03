/*=============================*/
//	Document ready
/*=============================*/

$( document ).ready(function() {
	getBuckets();	
	AWS.config.update({accessKeyId: 'AKIAI62PVLEIDCVMJPKQ', secretAccessKey: '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'});
	AWS.config.region = 'eu-central-1';
	s3 = new AWS.S3();
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
	var bucket_name = 'bucketmanual-fred';
	var content_type = "text/plain;charset=UTF-8"
	var key = 'target003.txt' // TODO: rendre ça dynamique, il faudra mettre dans la var?
	var url_up = 'none';
	var url_down = 'none';
	var params = {Bucket: bucket_name, Key: key, Expires: expires_in_seconds};

	// Get the presigned url to upload file
	var url_up = s3.getSignedUrl('putObject', params);

	//console.log('The URL to upload is', url_up);

	// Get the presigned url to download file
	var url_down = s3.getSignedUrl('getObject', params);

	//console.log('The URL to download is', url_down);

	var data = {
	    "expires_in_seconds": expires_in_seconds,
	    "url_up": url_up,
	    "url_down": url_down,
	    "status": "empty"
	}

	//Test
	console.log("The good URL = "+url_up);
	console.log("is the good URL encoded? = "+isEncoded(url_up));

	// Upload to S3
	// $.ajax({
	//   url: url_up,
	//   type: 'PUT',
	//   data: 'data to upload into URL',
	//   }).done(function(data) {
	//   	console.log(data);
	//     alert( "second success" );
	//   })
	//   .fail(function(data) {
	//     console.log(data);
	//     alert( "error" );
	//   })
	//   .always(function(data) {
	//   	console.log(data);
	//     alert( "finished" );
	//   });

	// Create the db entry
	$.post('/api/buckets/', data, function(result) {
		var id = result.id
	    var created = new Date(result.created);
    	var expires_in_seconds = result.expires_in_seconds;
    	var expiration_date = new Date(created.getTime()+result.expires_in_seconds*1000);
    	var url_up = result.url_up;
    	console.log("The URL after post = "+result.url_up);
    	console.log("is the URL after post encoded? = "+isEncoded(result.url_up));
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

function upload(){

	/*
	 * Get the presigned url in url_up by looking at the bd to find the bucket with a uuid
	 */

	// 1. Get the uuid from the url
	var bucket_url = "/api/buckets?uuid="+getUrlVars()["uuid"];

	// 2. Get the url_up from the bucket with the aforementionned uuid
	var bucket = $.get(bucket_url);

	bucket.always(function(data) {
		
		// Test
		console.log("URL in upload func = "+data[0].url_up);
		console.log("is the URL in upload func encoded? = "+isEncoded(data[0].url_up));
		alert("stop");
		
		// 3. Upload the data! Ajaxception \o/
		$.ajax({
		  url: data[0].url_up,
		  type: 'PUT',
		  data: 'data to upload into URL 03.12.15',
		  headers: {'Content-Type': 'application/json'},
		  }).done(function(data) {
		  	console.log(data);
		    alert( "second success" );
		  })
		  .fail(function(data) {
		    console.log(data);
		    alert( "error" );
		  })
		  .always(function(data) {
		  	console.log(data);
		    alert( "finished" );
		  });  
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
        	//Test
        	console.log("URL from getBuckets = "+value.url_up);
        	var url_up = value.url_up;
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


function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function isEncoded(str) {
    return typeof str == "string" && decodeURIComponent(str) !== str;
}

