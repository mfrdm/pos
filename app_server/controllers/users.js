var helper = require('../../libs/node/helper');

module.exports = new User();

function User() {
    // get home page
    this.readHomePage = function(req, res) {
        var data = {
            user: {

            },
            look: {
                title: "Test",
                css: [], // FIX: add name
            },
        };
        res.render('index', { data: data });
    };

    this.readLoginPage = function(req, res) {
        var data = {
            user: {

            },
            look: {
                title: "Login",
                css: [], // FIX: add name
            },
        };

        res.render('login', { data: data });
    };
};