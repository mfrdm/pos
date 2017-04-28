var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var AttendanceModel = mongoose.model('attendances');

module.exports = new Attendance();

function Attendance() {

	this.readSomeAttendances = function(req, res) {
		dbHelper.findSome(req, res, AttendanceModel);
	};

	this.readOneAttendanceById = function(req, res) {
		dbHelper.findOneById(req, res, AttendanceModel, 'attendanceId');
	};

	this.createOneAttendance = function(req, res) {
		dbHelper.insertOne(req, res, AttendanceModel);
	};

	this.updateOneAttendanceById = function(req, res) {
		dbHelper.updateOneById(req, res, AttendanceModel, 'attendanceId');
	};

};