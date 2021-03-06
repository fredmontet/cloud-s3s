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

    /**
     * Set the credentials in localStorage variables
     * @returns {boolean}
     */
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
        expiration: $("#expiration"),
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

    /**
     * Connect to Amazon Web Services according
     * to localStorage variables
     * @returns {a AWS s3 connection object}
     */
    connectToAws: function () {
        var akid = localStorage.getItem("accessKeyId");
        var sak = localStorage.getItem("secretAccessKey");
        AWS.config.update({accessKeyId: akid, secretAccessKey: sak});
        AWS.config.region = 'eu-central-1';
        AWS.config.signatureVersion = 'v4';
        s3 = new AWS.S3();
        return s3;
    },

    /**
     * Build a Fily Bucket
     * This function build a JS object of a bucket with all the informations needed to send to filyRest API
     * @returns {{bucket_name: string, uuid: string, expires_in_seconds: int, url_up: string, url_down: string, status: string}}
     */
    buildBucket: function () {

        var expires_in_seconds = s.expiration.val();
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

    /**
     * One liner function to compare a given date with now
     * returns true if expirationDate is in the past
     * @param expirationDate
     * @returns {boolean}
     */
    isLinkExpired: function (expirationDate) {
        return (expirationDate < new Date());
    },

    /**
     * Build a UUID
     * @returns {string}
     */
    getUuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * Append a row to a table as the one in the admin page
     * This function also takes care of row coloring depending
     * on the status of the link and button disabling if the given
     * links are expired
     * @param id
     * @param expiration_date
     * @param status
     * @param isLinkExpired
     */
    addRow: function (id, expiration_date, status, isLinkExpired) {

        // Affiche des couleurs pour signaler le status des fichiers
        switch(status) {
            case "empty":
                var statusColor =  null;
                var down_disabled = "disabled=\"disabled\"";
                break;
            case "full":
                var statusColor = "success";

                break;
            case "expired":
                var statusColor = "danger";
                var up_disabled = "disabled=\"disabled\"";
                break;
        }

        $(".table").append('<tr id="bucket-'+ id +'" class="bucket-row '+statusColor+' data-bucket-id="' + id + '">\
            <td>' + expiration_date + '</td>\
            <td>' + status + '</td>\
            <td>\
            <button onclick="AdminPage.uploadLinkBtn('+id+')" type="button" '+up_disabled+' class="upload-link-btn btn btn-default btn-xs">Upload link</button>\
            </td>\
            <td>\
            <button onclick="AdminPage.downloadFileBtn('+id+')" type="button" '+down_disabled+' class="download-file-btn btn btn-default btn-xs">Download file</button>\
            <button onclick="AdminPage.deleteUrlBtn('+id+')" type="button" class="delete-url-btn btn btn-default btn-xs pull-right">Delete</button>\
            </td>\
            </tr>');


    },

    /**
     * Removes a row of the link table in the admin page
     * @param id
     */
    removeRow: function (id) {
        $('#bucket-' + id).remove();
    },


    /* REST Request
    /*-----------------------------*/

    /**
     * GET all the fily buckets from the filyRest API
     */
    getBuckets: function () {
        $.getJSON("/api/buckets", function (data) {
            $.each(data, function (i, value) {

                var bucket = {
                    "id": value.id,
                    "bucket_name": value.bucket_name,
                    "uuid": value.uuid,
                    "expires_in_seconds": value.expires_in_seconds,
                    "url_up": value.url_up,
                    "url_down": value.url_down,
                    "status": value.status,
                }

                // Calcul de la date d'expiration
                var created = new Date(value.created);
                var expiration_date = new Date(created.getTime() + value.expires_in_seconds * 1000);
                var isExpired = AdminPage.isLinkExpired(expiration_date);

                // Ajustement des status
                if(isExpired){
                    BucketPage.setStatus("expired", bucket);
                    bucket.status = "expired";
                }

                AdminPage.addRow(bucket.id, expiration_date, bucket.status, isExpired);
            });
        });
    },

    /**
     * POST to the filyRest API of a given bucket
     * in a JS Object
     * @param bucket
     */
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

    /**
     * GET the fily upload link
     * @param id - the bucket id
     */
    getUploadLink: function (id) {
        $.getJSON("/api/buckets/" + id, function (data) {
            alert(window.location.origin + "/bucket?uuid=" + data.uuid);
        });
    },

    /**
     * DELETE a link on filyRest
     * remove the file from the S3 Bucket
     * Delete the row from the link table of the admin page
     * @param id - the bucket id
     */
    deleteUrl: function (id) {

        // 1. Get the bucket with its id
        var bucket = $.get("/api/buckets/" + id);

        // 2. Delete the data! Ajaxception \o/
        bucket.done(function (data) {

            var params = {
                Bucket: data.bucket_name,
                Key: data.uuid,
            };

            // Delete on s3
            s.s3conn.deleteObject(params, function(err, datas3) {
                if (err) console.log(err, err.stack);
                else     console.log(datas3);
            });

            // Delete on Fily
            $.ajax({
                url: '/api/buckets/' + id,
                type: 'DELETE',
                success: function (result) {
                    console.log(result);
                    AdminPage.removeRow(id);
                }
            });
        });
    },

    /**
     * GET the bucket with its id and
     * GET the url to download the file from this bucket
     * @param id - the bucket id
     */
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

    /**
     * Upload a file from the fily bucket page form to the
     * S3 bucket, use a GET method to get the bucket informations
     * and a PUT method to give the data to Amazon S3.
     * @param file - the file to upload
     * @param params - the header params (find them in line 391)
     */
    upload: function (file, params) {

        // 1. Get the uuid from the url
        var bucket_url = "/api/buckets?uuid=" + BucketPage.getUrlVars()["uuid"];

        // 2. Get the url_up from the bucket with the aforementioned uuid
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

    /**
     * Get the URL Variable
     * @returns {Array} of the url vars
     */
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

    /**
     * Set the status of a bucket with
     * a PUT method
     * @param status - the status to put
     * @param bucket - the bucket JS Object
     */
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
