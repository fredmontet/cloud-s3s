/*=============================*/
//	Document ready
/*=============================*/

$( document ).ready(function() {
   
	getBuckets();

});


AWS.config.update({accessKeyId: 'AKIAIUV77YIHYNYG3RFQ', secretAccessKey: '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'});
AWS.config.region = 'us-west-1';

s3 = new AWS.S3;


/*=============================*/
//	UI Actions
/*=============================*/

//	Admin page actions
/*-----------------------------*/



function getUrl(){

	// TODO: get the presigned url here instead of var data
	data = {
	    "expires_in_seconds": 4500,
	    "url": "http://www.youtube.com",
	    "status": "full"
	}

	$.post('/api/buckets/', data, function(result) {
	    var created = new Date(result.created);
    	var expires_in_seconds = result.expires_in_seconds;
    	var expiration_date = new Date(created.getTime()+result.expires_in_seconds*1000);
    	var url = result.url;
    	var status = result.status;
    	AddRow(expiration_date, status, url);
	});
}

function downloadFile(){
	console.log("downloadFile");
}

function deleteUrl(){
	$.ajax({
    url: '/api/buckets/',
    type: 'DELETE',
    success: function(result) {
        	var created = new Date(result.created);
	    	var expires_in_seconds = result.expires_in_seconds;
	    	var expiration_date = new Date(created.getTime()+result.expires_in_seconds*1000);
	    	var url = result.url;
	    	var status = result.status;
	    	AddRow(expiration_date, status, url);
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

function getBuckets(){
	$.getJSON( "/api/buckets", function( data ) {
	  $.each(data, function(i,value){
        	var created = new Date(value.created);
        	var expires_in_seconds = value.expires_in_seconds;
        	var expiration_date = new Date(created.getTime()+value.expires_in_seconds*1000);
        	var url = value.url;
        	var status = value.status;
        	AddRow(expiration_date, status, url);
        });
	});
}


function AddRow(expiration_date, status, url)
{
  	$(".table").append('<tr>\
			<td>'+expiration_date+'</td>\
            <td>'+status+'</td>\
            <td><a href="'+url+'"><button type="button" class="btn btn-default btn-xs">Bucket link</button></a></td>\
			<td>\
				<button onclick="downloadFile()" type="button" class="btn btn-default btn-xs">Download file</button>\
				<button onclick="deleteUrl()" type="button" class="btn btn-default btn-xs">Delete</button>\
			</td>\
		</tr>')
}