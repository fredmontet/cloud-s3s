/*=============================*/
//	Document ready
/*=============================*/

$(document).ready(function() {

    var currentPage = window.location.pathname;

    switch(currentPage) {
        case "/":
            LoginPage.init();
            break;
        case "/admin":
            AdminPage.init();
            break;
        case "/bucket":
            BucketPage.init();
            break;
    }

});

/*=============================*/
//	The settings variable
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

    init: function () {
        s = this.settings;
    },

    /* On click actions
    /*-----------------------------*/

    loginBtn: function () {
      LoginPage.setCredentials();
    },

    /* Page functions
    /*-----------------------------*/

    setCredentials: function () {
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
        generateBtn: $("#generate-btn"),
        uploadLinkBtn: $(".upload-link-btn"),
        downloadFileBtn: $(".download-file-btn"),
        deleteUrlBtn: $(".delete-url-btn"),
        bucketTable: $("#table"),
        s3conn: null,
    },

    init: function () {
        s = this.settings;
        s.s3conn = this.connectToAws();
        this.getBuckets();
    },

    /* On click actions
    /*-----------------------------*/

    generateBtn: function () {
        var bucket = this.buildBucket();
        this.postBucket(bucket);
    },

    uploadLinkBtn: function (id) {
        this.getUploadLink(id);
    },

    downloadFileBtn: function (id) {
        this.downloadFile(id);
    },

    deleteUrlBtn: function(id){
        this.deleteUrl(id);
    },


    /* Page functions
    /*-----------------------------*/

    connectToAws: function () {
        var akid = localStorage.getItem("accessKeyId");
        var sak = localStorage.getItem("secretAccessKey");
        AWS.config.update({accessKeyId: akid, secretAccessKey: sak});
        AWS.config.region = 'eu-central-1';
        AWS.config.signatureVersion = 'v4';
        s3 = new AWS.S3();
        return s3;
    },

    buildBucket: function () {

        var expires_in_seconds = 3600;
        var bucket_name = localStorage.getItem("bucketName");
        var uuid = this.getUuid();
        var url_up = 'none';
        var url_down = 'none';

        var params = {
            Bucket: bucket_name,
            Key: uuid,
            Expires: expires_in_seconds,
        };

        // Get the presigned url to upload file
        url_up = s.s3conn.getSignedUrl('putObject', params);

        // Get the presigned url to download file
        url_down = s.s3conn.getSignedUrl('getObject', params);

        var data = {
            "bucket_name": bucket_name,
            "uuid": uuid,
            "expires_in_seconds": expires_in_seconds,
            "url_up": url_up,
            "url_down": url_down,
            "status": "empty"
        }

        return data;
    },

    getUuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    addRow: function (id, expiration_date, status) {
        $(".table").append('<tr id="bucket-'+ id +'" class="bucket-row" data-bucket-id="' + id + '">\
            <td>' + expiration_date + '</td>\
            <td>' + status + '</td>\
            <td>\
            <button onclick="AdminPage.uploadLinkBtn('+id+')" type="button" class="upload-link-btn btn btn-default btn-xs">Upload link</button>\
            </td>\
            <td>\
            <button onclick="AdminPage.downloadFileBtn('+id+')" type="button" class="download-file-btn btn btn-default btn-xs">Download file</button>\
            <button onclick="AdminPage.deleteUrlBtn('+id+')" type="button" class="delete-url-btn btn btn-default btn-xs">Delete</button>\
            </td>\
            </tr>');
    },

    removeRow: function (id) {
        $('#bucket-' + id).remove();
    },


    /* REST Request
    /*-----------------------------*/

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
                AdminPage.addRow(id, expiration_date, status, url_up, url_down);
            });
        });
    },

    postBucket: function (bucket) {
        $.post('/api/buckets/', bucket, function (result) {
            var id = result.id
            var created = new Date(result.created);
            var expires_in_seconds = result.expires_in_seconds;
            var expiration_date = new Date(created.getTime() + result.expires_in_seconds * 1000);
            var url_up = result.url_up;
            var url_down = result.url_down;
            var status = result.status;
            AdminPage.addRow(id, expiration_date, status, url_up, url_down);
        });
    },

    getUploadLink: function (id) {
        $.getJSON("/api/buckets/" + id, function (data) {
            alert(window.location.origin + "/bucket?uuid=" + data.uuid);
        });
    },

    deleteUrl: function (id) {
        $.ajax({
            url: '/api/buckets/' + id,
            type: 'DELETE',
            success: function (result) {
                AdminPage.removeRow(id);
            }
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
                window.location = data0.url_down;
            }).fail(function (data1) {
            }).always(function (data1) {
            });
        });
    },

};

/*=============================*/
//	Bucket Page
/*=============================*/

var BucketPage = {

    settings: {
        uploadBtn: $("#upload-btn"),
        fileInput: $("#file-input"),
        uploadForm: $("#upload-form")[0],
        headerParams: {},
    },

    init: function () {
        s = this.settings;
        this.bindUIActions();
    },


    /* UI actions
    /*-----------------------------*/

    bindUIActions: function () {

        s.fileInput.on("change", function () {
            s.headerParams = {
                "X-File-Name": s.fileInput[0].name,
                "X-File-Size": s.fileInput[0].size,
                "X-File-Type": s.fileInput[0].type,
            }
        });
    },

    /* On click actions
    /*-----------------------------*/

    uploadBtn: function () {
        BucketPage.upload(new FormData(s.uploadForm), s.headerParams);
    },
    
    /* Page functions
    /*-----------------------------*/

    upload: function (file, params) {
        /*
         * Get the presigned url in url_up by looking at the bd to find the bucket with a uuid
         */

        // 1. Get the uuid from the url
        var bucket_url = "/api/buckets?uuid=" + BucketPage.getUrlVars()["uuid"];

        // 2. Get the url_up from the bucket with the aforementionned uuid
        var bucket = $.get(bucket_url);

        // 3. Upload the data! Ajaxception \o/
        bucket.done(function (data0) {
            $.ajax({
                url: data0[0].url_up,
                type: 'PUT',
                data: file,
                dataType: 'text',
                cache: false,
                processData: false,
                contentType: false,
                headers: params,
            }).done(function (data1) {
                BucketPage.setStatus("full", data0[0]);
            }).fail(function (data1) {
            }).always(function (data1) {
            });
        });
    },

    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },

    setStatus: function (status, bucket) {
        bucket.status = status;
        $.ajax({
            url: "/api/buckets/" + bucket.id + "/",
            type: 'PUT',
            data: JSON.stringify(bucket),
            dataType: "json",
            contentType: 'application/json; charset=UTF-8',
        }).done(function (data) {
        }).fail(function (data) {
        }).always(function (data) {
        });
    },

};
