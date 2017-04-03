var mongoose = require('mongoose');
var request = require('request');

module.exports = new function() {
    // importing
    this.getAPIOption = function() {
        var defaultPort = 3000;
        // var defaultHost = "http://localhost";
        var defaultHost = 'http://localhost';
        var apiOptions = {
            server: defaultHost + ":" + defaultPort,
        };

        if (process.env.NODE_ENV === 'production') {
            apiOptions.server = "http://104.199.160.180"; // FIX: CHANGE later
        }
        return apiOptions
    };

    this.simpleTryCatch = function(f, mode, res) {
        try {
            f();
        } catch (ex) {
            if (!mode) {
                console.log(ex);

            } else if (mode === 1) {
                sendJsonRes(res, 500, err);
                return
            }
        }
    };

    // reverse = get those not in keys
    this.getSubObj = function(obj, keys, reverse) {
        var d = {};
        if (reverse) {
            for (var k in obj) {
                if (keys.indexOf(k) === -1) {
                    d[k] = obj[k];
                }
            }
        } else {
            for (var k in obj) {
                if (keys.indexOf(k) !== -1) {
                    d[k] = obj[k];
                }
            }
        }

        return d
    };

    // get a random value in a range
    this.getRandIndex = function(num, start) {
        start = start ? start : 0;
        var seed = Math.random();
        return Math.floor(seed * num) + start
    };

    this.getRandSubArray = function(arr, multi) {
        if (!multi) {
            return arr[getRandIndex(arr.length)]
        }

        var seed = Math.random();
        var len = arr.length;
        var start = Math.floor(seed * len);
        var num = Math.ceil(seed * len);
        return arr.concat([]).splice(start, num);
    };

    // get an array of consecutive values
    this.getRange = function(num, start) {
        start = start ? start : 1;
        return Array.from(Array(num).keys()).map(x => x + start)
    };

    // check if a object has required properties
    // often used to validate data like authentication
    this.checkRequired = function(obj, required) {
        var num = required.length;
        for (var i = 0; i < num; i++) {
            if (!obj[required[i]]) {
                return false
            }
        }

        return true
    };

    this.from_obj_to_query = function(obj) {
        var str = "";
        for (var key in obj) {
            if (str != "") {
                str += "&";
            }
            str += key + "=" + encodeURIComponent(obj[key]);
        }

        return str
    };
}
