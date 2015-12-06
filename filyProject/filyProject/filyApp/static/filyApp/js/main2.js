/*=============================*/
//	Document ready
/*=============================*/

$( document ).ready(function() {

    var currentPage = window.location.pathname;

    switch(currentPage) {
        case "/login":
            LoginPage.init();
            break;
        case "/admin":
            AdminPage.init();
            break;
        case "/bucket":
            UploadPage.init();
            break;
    }

});

/*=============================*/
//	The setting variable
/*=============================*/

var s;

/*=============================*/
//	Login Page
/*=============================*/

var LoginPage = {

        settings: {
            loginBtn: $("#login-btn"),
            accessKeyIdField: $(".akid"),
            secretAccessKeyField: $(".sak"),
            bucketNameField: $(".bn"),
        },

        init: function() {
            s = this.settings;
            this.bindUIActions();
        },

        bindUIActions: function() {
            s.loginBtn.on("click", function() {
                LoginPage.setCredentials();
            });
        },

        setCredentials: function() {
            localStorage.setItem("accessKeyId", s.accessKeyIdField.val());
            localStorage.setItem("secretAccessKey", s.secretAccessKeyField.val());
            localStorage.setItem("bucketName", s.bucketNameField.val());
            return true;
        }

    };

/*=============================*/
//	Admin Page
/*=============================*/

var AdminPage = {

        settings: {
            generateBtn:        $("#generate-btn"),
            uploadLinkBtn:      $(".upload-link-btn"),
            downloadFileBtn:    $(".download-file-btn"),
            deleteUrlBtn:       $(".delete-url-btn"),
        },

        init: function () {
            s = this.settings;
            this.bindUIActions();
            this.connectToAws();
            this.getBuckets();
        },

        bindUIActions: function () {

            s.generateBtn.on("click", function () {
                AdminPage.getUrl();
                AdminPage.addRow();
            });

            s.uploadLinkBtn.on("click", function () {
                AdminPage.getUploadLink();
            });

            s.downloadFileBtn.on("click", function () {
                AdminPage.downloadFile();
            });

            s.deleteUrlBtn.on("click", function() {
                AdminPage.deleteUrl();
                AdminPage.removeRow();
            });

        },

        connectToAws: function () {
            var akid = localStorage.getItem("accessKeyId");
            var sak = localStorage.getItem("secretAccessKey");
            AWS.config.update({accessKeyId: akid, secretAccessKey: sak});
            AWS.config.region = 'eu-central-1';
            AWS.config.signatureVersion = 'v4';
            s3 = new AWS.S3();
            return s3;
        },

        getUrl: function () {

            var expires_in_seconds = 3600;
            var bucket_name = localStorage.getItem("bucketName");
            var uuid = AdminPage.getUuid();
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
            $.post('/api/buckets/', data, function (result) {
                var id = result.id
                var created = new Date(result.created);
                var expires_in_seconds = result.expires_in_seconds;
                var expiration_date = new Date(created.getTime() + result.expires_in_seconds * 1000);
                var url_up = result.url_up;
                var url_down = result.url_down;
                var status = result.status;
                addRow(id, expiration_date, status, url_up, url_down);
            });
        },

        getUploadLink: function () {
            $.getJSON("/api/buckets/" + id, function (data) {
                alert(window.location.origin + "/bucket?uuid=" + data.uuid);
            });
        },

        downloadFile: function (id) {

// 1. Get the bucket with its id
            var bucket = $.get("/api/buckets/" + id);

// 2. Upload the data! Ajaxception \o/
            bucket.done(function (data0) {
                $.ajax({
                    url: data0.url_down,
                    type: 'GET',
                }).done(function (data1) {
                    console.log("success");
                    window.location = data0.url_down;
                })
                    .fail(function (data1) {
                        console.log("error");
                    })
                    .always(function (data1) {
                        console.log("finished");
                    });
            });
        },

        deleteUrl: function (id) {
            $.ajax({
                url: '/api/buckets/' + id,
                type: 'DELETE',
                success: function (result) {
                    removeRow(id);
                }
            });
        },

        getBuckets: function () {
            $.getJSON("/api/buckets", function (data) {
                $.each(data, function (i, value) {
                    var id = value.id;
                    var created = new Date(value.created);
                    var expires_in_seconds = value.expires_in_seconds;
                    var expiration_date = new Date(created.getTime() + value.expires_in_seconds * 1000);
                    var url_up = value.url_up;
                    var url_down = value.url_down;
                    var status = value.status;
                    addRow(id, expiration_date, status, url_up, url_down);
                });
            });
        },

        getUuid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        addRow: function (id, expiration_date, status, url_up, url_down) {
            $(".table").append('<tr id="bucket-' + id + '">\
                <td>' + expiration_date + '</td>\
                <td>' + status + '</td>\
                <td>\
                <button type="button" class="upload-link-btn btn btn-default btn-xs">Upload link</button>\
                </td>\
                <td>\
                <button type="button" class="download-file-btn btn btn-default btn-xs">Download file</button>\
                <button data-bucket-id="' + id + '" type="button" class=" delete-url-btn btn btn-default btn-xs">Delete</button>\
                </td>\
                </tr>');
        },

        removeRow: function (id){
            $('#bucket-' + id).remove();
        },

    };

/*=============================*/
//	Upload Page
/*=============================*/

var UploadPage = {

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
