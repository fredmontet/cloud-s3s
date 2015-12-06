/*=============================*/
//	Document ready
/*=============================*/

$( document ).ready(function() {

	//	Login page DR
	/*-----------------------------*/
	
	$('.login').click(function() {
		setCred();
	});

	if(window.location.pathname != "/login"){
		var akid = localStorage.getItem("accessKeyId");
		var sak = localStorage.getItem("secretAccessKey");
		AWS.config.update({accessKeyId: akid, secretAccessKey: sak});
		AWS.config.region = 'eu-central-1';
		AWS.config.signatureVersion = 'v4';
		s3 = new AWS.S3();
	}


	//	Admin page DR
	/*-----------------------------*/
	
	getBuckets();


	//	Bucket page DR
	/*-----------------------------*/


	var headerParams;
	var file;

	$('#file-chooser').change(function(){
	    file = this.files[0];
	    var headerParams = {
			"X-File-Name": this.files[0].name,
	    	"X-File-Size": this.files[0].size,
	    	"X-File-Type": this.files[0].type,
    	}
	});

	$('#upload-btn').click(function() {
		  var data = new FormData($("#upload-form")[0]);
          upload(data, headerParams);
	});

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
	var uuid = getUuid();
	var url_up = 'none';
	var url_down = 'none';

	var params = {
		Bucket: bucket_name, 
		Key: uuid, 
		Expires: expires_in_seconds,
	};

	// Get the presigned url to upload file
	var url_up = s3.getSignedUrl('putObject', params);

	// Get the presigned url to download file
	var url_down = s3.getSignedUrl('getObject', params);

	var data = {
		"bucket_name": bucket_name,
		"uuid": uuid,
	    "expires_in_seconds": expires_in_seconds,
	    "url_up": url_up,
	    "url_down": url_down,
	    "status": "empty"
	}

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
	  	alert(window.location.origin+"/bucket?uuid="+data.uuid);
	});
}

function downloadFile(id){
	/*
	 * Get the presigned url in url_down
	 */

	// 1. Get the bucket with its id
	var bucket = $.get("/api/buckets/"+id);

	// 2. Upload the data! Ajaxception \o/
	bucket.done(function(data0) {
		$.ajax({
		  url: data0.url_down,
		  type: 'GET',
		  }).done(function(data1) {
		    console.log( "success" );
		    window.location = data0.url_down;
		  })
		  .fail(function(data1) {
		    console.log( "error" );
		  })
		  .always(function(data1) {
		    console.log( "finished" );
		  });  
	});
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

function upload(file, params){

	/*
	 * Get the presigned url in url_up by looking at the bd to find the bucket with a uuid
	 */

	// 1. Get the uuid from the url
	var bucket_url = "/api/buckets?uuid="+getUrlVars()["uuid"];

	// 2. Get the url_up from the bucket with the aforementionned uuid
	var bucket = $.get(bucket_url);

	// 3. Upload the data! Ajaxception \o/
	bucket.done(function(data0) {
		$.ajax({
		  url: data0[0].url_up,
		  type: 'PUT',
          data: file,
          dataType: 'text',
          cache: false,
          processData: false,
  		  contentType: false,
  		  headers: params,
		  }).done(function(data1) {
		    console.log( "success" );
		  })
		  .fail(function(data1) {
		    console.log( "error" );
		  })
		  .always(function(data1) {
		    console.log( "finished" );
		  });  
	});
	//TODO ajax to change the status of the link in admin

}

/*=============================*/
//	Functions
/*=============================*/

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
        	var url_up = value.url_up;
        	var url_down = value.url_down;
        	var status = value.status;
        	addRow(id, expiration_date, status, url_up, url_down);
        });
	});
}

function addRow(id, expiration_date, status, url_up, url_down){
  	$(".table").append('<tr id="bucket-'+id+'">\
			<td>'+expiration_date+'</td>\
            <td>'+status+'</td>\
            <td>\
            <button onclick="uploadLink('+id+')" type="button" class="btn btn-default btn-xs">Upload link</button>\
            </td>\
			<td>\
			<button onclick="downloadFile('+id+')" type="button" class="btn btn-default btn-xs">Download file</button>\
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

function getUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
	});
}

function setCred(){
	localStorage.setItem("accessKeyId", $(".akid").val());
	localStorage.setItem("secretAccessKey", $(".sak").val());  	
	return true;
}


















