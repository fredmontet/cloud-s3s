/*=============================*/
//	Document ready
/*=============================*/

$( document ).ready(function() {
   
	getBuckets();

	AWS.config.update({accessKeyId: 'AKIAJHOXSZCIS73PIKPA', secretAccessKey: '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'});
	AWS.config.region = 'eu-central-1';

	s3 = new AWS.S3;

});

var params = {
  Bucket: 'bucketmanual',
};

/*=============================*/
//	UI Actions
/*=============================*/

//	Admin page actions
/*-----------------------------*/

function getUrl(){

	// TODO: get the presigned url here instead of var data

	var expires_in_seconds = 3600;
	var key = 'testkey'
	var url = 'none'

	/*
	var params = {Bucket: 'bucketauto', Key: 'key', Body: 'body', Expires: expires_in_seconds};
	var url = s3.getSignedUrl('putObject', params);
	console.log('The URL is', url);
	*/
	data = {
	    "expires_in_seconds": expires_in_seconds,
	    "url": url,
	    "status": "empty"
	}

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


