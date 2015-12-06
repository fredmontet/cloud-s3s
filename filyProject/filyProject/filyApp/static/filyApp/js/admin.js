var s,
    AdminPage = {

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