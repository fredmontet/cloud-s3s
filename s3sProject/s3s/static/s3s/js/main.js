$( document ).ready(function() {
    


});


	function generate(){
		$.get( "/s3s/generate", function( data ) {
		  console.log(data)
		});
	}