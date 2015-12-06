
var s,
    LoginPage = {

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
