
var s,
    UploadPage = {

        settings: {
            uploadBtn:  $("#upload-btn"),
            fileInput:  $("#file-input"),
            uploadForm: $("#upload-form")[0],
            headerParams: {},
        },

        init: function() {
            s = this.settings;
            this.bindUIActions();
        },

        bindUIActions: function() {

            s.uploadBtn.on("click", function() {
                UploadPage.upload(new FormData(s.uploadForm), s.headerParams);
            });

            s.fileInput.on("change", function(){
                s.headerParams = {
                    "X-File-Name": s.fileInput.files[0].name,
                    "X-File-Size": s.fileInput.files[0].size,
                    "X-File-Type": s.fileInput.files[0].type,
                }
            });
        },

        upload: function(file, params) {
            /*
             * Get the presigned url in url_up by looking at the bd to find the bucket with a uuid
             */

            // 1. Get the uuid from the url
            var bucket_url = "/api/buckets?uuid="+UploadPage.getUrlVars()["uuid"];

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
                    UploadPage.setStatus("full", data0[0]);
                })
                    .fail(function(data1) {
                        console.log( "error" );
                    })
                    .always(function(data1) {
                        console.log( "finished" );
                    });
            });
        },

        getUrlVars: function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },

        setStatus: function(status, bucket) {
            bucket.status = status;
            $.ajax({
                url: "/api/buckets/"+bucket.id+"/",
                type: 'PUT',
                data: JSON.stringify(bucket),
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
            }).done(function(data) {
                console.log( "success" );
            })
                .fail(function(data) {
                    console.log( "error" );
                })
                .always(function(data) {
                    console.log( "finished" );
                });
        },

    };