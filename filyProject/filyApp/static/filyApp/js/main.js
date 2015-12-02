/*=============================*/
//	Document ready
/*=============================*/

$( document ).ready(function() {
   
	getBuckets();
	upload();

	AWS.config.update({accessKeyId: 'AKIAJUR2T2KVHZP47YEA', secretAccessKey: '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'});
	AWS.config.region = 'eu-central-1';

	s3 = new AWS.S3;

});

// var params = {
// 	  Bucket: 'bucketmanual', /* required */
// 	  //ACL: 'private | public-read | public-read-write | authenticated-read',
// 	  //GrantFullControl: 'STRING_VALUE',
// 	  //GrantRead: 'STRING_VALUE',
// 	  //GrantReadACP: 'STRING_VALUE',
// 	  //GrantWrite: 'STRING_VALUE',
// 	  //GrantWriteACP: 'STRING_VALUE'
// 	};


/*=============================*/
//	UI Actions
/*=============================*/

//	Admin page actions
/*-----------------------------*/

function getUrl(){

	// TODO: get the presigned url here instead of var data

	var expires_in_seconds = 3600;
	var key = 'target2.txt'
	var presignedUrl = 'none'

	var params = {Bucket: 'bucketmanual', Key: key};
	s3.getSignedUrl('putObject', params, function (err, url) {
	  console.log('The URL is', url);
	  presignedUrl = url;
	});
	
	data = {
	    "expires_in_seconds": expires_in_seconds,
	    "url": presignedUrl,
	    "status": "empty"
	}

	$.ajax({
	  url: presignedUrl, // the presigned URL
	  type: 'PUT',
	  data: 'data to upload into URL',
	  success: function() { console.log('Uploaded data successfully.'); }
	});

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
	console.log("upload");

	
}


/*=============================*/
//	Functions
/*=============================*/

//	AWS Function
/*-----------------------------*/

function listObjects(){
	var params = {Bucket: 'bucketmanual'};
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
        	var url = value.url;
        	var status = value.status;
        	addRow(id, expiration_date, status, url);
        });
	});
}

function getBucketCors() {
	console.log('Getting CORS');
	var params = {Bucket: 'bucketmanual'};
	s3.getBucketCors(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
}

function getBucketFile() {
	var params = {Bucket: 'bucketmanual', Key: 'target.txt'};
	var url = s3.getSignedUrl('getObject', params);
	console.log(url);
}

function putBucketFile() {

	var params = {Bucket: 'bucketmanual', Key: 'target.txt'};
	var url = s3.getSignedUrl('getObject', params);
	console.log(url);
}


function addRow(id, expiration_date, status, url){
  	$(".table").append('<tr id="bucket-'+id+'">\
			<td>'+expiration_date+'</td>\
            <td>'+status+'</td>\
            <td><a href="'+url+'"><button type="button" class="btn btn-default btn-xs">Bucket link</button></a></td>\
			<td>\
				<button onclick="downloadFile()" type="button" class="btn btn-default btn-xs">Download file</button>\
				<button onclick="deleteUrl('+id+')" data-bucket-id="'+id+'" type="button" class="btn btn-default btn-xs">Delete</button>\
			</td>\
		</tr>')
}

function removeRow(id)
{
	$('#bucket-'+id).remove();
}


