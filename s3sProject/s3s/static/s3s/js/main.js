$( document ).ready(function() {
   
});

function getUrl(){
	$.get( "/s3s/manager?action=get-url", function( data ) {
	  console.log(data)
	});
}

function upload(){
	console.log("upload");
}

function addToTable(){

}