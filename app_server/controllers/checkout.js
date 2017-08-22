var moment = require ('moment');
var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('Promocodes');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
var Occupancies = mongoose.model ('Occupancies');
var Accounts = mongoose.model ('Accounts');
var request = require ('request');

module.exports = new Checkout();

function Checkout() {

	// assume promotion codes, if provided, are valid, since checked when checking in
	this.createInvoice = function (req, res, next){
		Occupancies.findOne ({_id: req.params.occId}, {location: 0, staffId: 0, updateAt: 0}, function (err, foundOcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			if (foundOcc){
				foundOcc.checkoutTime = foundOcc.checkoutTime ? foundOcc.checkoutTime : moment ();
				
				try{
					foundOcc.getTotal ();
				}
				catch (err){
					next (err);
					return;
				}

				Customers.findOne ({_id: foundOcc.customer._id})
					.populate ({
						path: 'accounts',
						match: 	{
							start: {$lte: new Date ()},
							end: {$gte: new Date ()},
							services: foundOcc.service.name.toLowerCase (), 
							$or: [{amount: {$gt: 0}}, {$and: [{'recursive.isRecursive': true}, {amount: {$lte: 0}}]}]
						},
						// select: 'amount service unit label'
					}) 
					.exec (function (err, cus){
						if (err){
							console.log (err);
							next (err);
						}
						
						if (cus.accounts.length){
							cus.accounts = cus.accounts.filter (function (acc, i, arr){
								acc.renew ();
								if (acc.amount > 0){
									if (acc.recursive.isRecursive && acc.recursive.renewNum >= acc.recursive.maxRenewNum){
										return false
									}
									else{
										return acc;
									}
									
								}

								return false
							});
						}

						foundOcc = foundOcc.toObject (); // convert to add data
						foundOcc.accounts = cus.accounts ? cus.accounts : [];
						res.json ({data: foundOcc});
					});

			}
			else{
				next ();
			}

		});
	};

	// assume call createInvoice beforehand, and an account passed is valid
	// at this moment only allow paid by one account at a checkout time
	// Apply only usage account, whose unit is hour
	this.withdrawUsageHourAccount = function (req, res, next){
		var accId = req.params.accId;
		var occ = JSON.parse (req.query.occ);
		occ = new Occupancies (occ);

		Accounts.findOne ({_id: accId}, function (err, foundAcc){
			if (err) {
				console.log (err);
				next (err);
			}
 			
			if (foundAcc){

				if (foundAcc.isRenewable ()){
					foundAcc.renew ();

					var accUpdate = {
						amount: foundAcc.amount,
						'recursive.lastRenewDate': foundAcc.recursive.lastRenewDate,
						'recursive.renewNum': foundAcc.recursive.renewNum,
					}

					Accounts.findOneAndUpdate ({_id: foundAcc._id}, {$set: accUpdate}, {new: true}, function (err, updatedAcc){
						if (err){
							console.log (err);
							next (err);
							return
						}

						if (!updatedAcc){
							next ();
							return
						}

						var beforeAccAmount = updatedAcc.amount;
						var beforeTotal = occ.total;
						var context = occ.getAccContext ();

						updatedAcc.withdraw (context);

						res.json ({
							data: {
								occ:{
									total: occ.total,
								},
								acc: {
									_id: updatedAcc._id,
									name: 'account',
									unit: updatedAcc.unit,
									paidTotal: beforeTotal - occ.total,
									paidAmount: beforeAccAmount - updatedAcc.amount,
									remain: updatedAcc.amount
								}
							}
						});
					});

				}
				else{
					var beforeAccAmount = foundAcc.amount;
					var beforeTotal = occ.total;
					var context = occ.getAccContext ();

					foundAcc.withdraw (context);

					res.json ({
						data: {
							occ:{
								total: occ.total,
							},
							acc: {
								_id: foundAcc._id,
								name: 'account',
								unit: foundAcc.unit,
								paidTotal: beforeTotal - occ.total,
								paidAmount: beforeAccAmount - foundAcc.amount, // already paid hours
								remain: foundAcc.amount							
							}
						}
					});
				}

			}
			else{
				res.json (); // may not the best way to indicate 
			}
			
		});
	};

	this.confirmCheckout = function(req, res, next) {
		var paid = req.body.data.total;
		var total = req.body.data.total;
		var usage = req.body.data.usage;
		var oriUsage = req.body.data.oriUsage;
		var price = req.body.data.price;
		var checkoutTime = req.body.data.checkoutTime;
		var promocodes = req.body.data.promocodes;
		var paymentMethod = req.body.data.paymentMethod ? req.body.data.paymentMethod : [];
		var note = req.body.data.note ? req.body.data.note : ''; // optional
		var status = 2;

		paymentMethod.map (function (x, i, arr){
			paid = paid - x.paidTotal;
		});

		Customers.findOneAndUpdate({_id:req.body.data.customer._id}, {$set:{checkinStatus:false}}, function(err, cus){
			if (err){
				console.log (err)
				next (err)
				return
			}
			else{

				var updateOcc = {
					status: status, 
					total: total, 
					paid: paid,
					usage: usage, 
					oriUsage: oriUsage,
					price: price,
					promocodes: promocodes,
					checkoutTime: checkoutTime,
					paymentMethod: paymentMethod,
					note: note
				}

				Occupancies.findOneAndUpdate ({_id: req.body.data._id}, {$set: updateOcc}, {new: true, fields: {updatedAt: 0, orders: 0, staffId: 0, location: 0, createdAt: 0, bookingId: 0}}, function (err, occ){
					if (err){
						console.log (err)
						next (err)
						return
					}

					if (occ){
						// update acc if being used
						// At this moment. Only one method is used at a time
						if (occ.paymentMethod && occ.paymentMethod.length){
							var acc;
							occ.paymentMethod.map (function (x, i, arr){
								if (x.name == 'account'){
									acc = x;
								}
							});

							if (acc){
								var updateStmt = {$inc: {amount: - acc.paidAmount}}
								Accounts.findOneAndUpdate ({_id: acc._id}, updateStmt, function (err, foundAcc){
									if (err){
										console.log (err);
										next (err);
										return
									}

									if (foundAcc){
										if (!foundAcc.activate){
											foundAcc.activate = true;
											foundAcc.initAccount ();
											Accounts.update ({_id: foundAcc._id}, {$set: {end: foundAcc.end, start: foundAcc.start,activate: foundAcc.activate}}, function (err, result){
												if (err){
													console.log (err);
													next (err);
													return
												}

												res.json ({data: {message: 'success'}});
												return;
											});
										}
										else{
											res.json ({data: {message: 'success'}});
											return;
										}
									}
									else{
										next ();
									}

									return;

								});
							}

						}
						else{
							res.json ({data: {message: 'success'}});
							return
						}
					}
					else{
						next ();
						return
					}

				})
			}
		})
	};

	// Automate process 
	// FIX: handle when prepaid by account
	this.creatOccupancies = function (req, res, next){
		var occ = req.body.data;
		newOcc = new Occupancies (occ);
		newOcc.getTotal ();
		newOcc.status = 2;

		newOcc.save (function (err, returnedOcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			Customers.findOneAndUpdate ({_id: returnedOcc.customer._id}, {$push: {occupancy: returnedOcc._id}}, function (err, cus){
				if (err){
					console.log (err);
					next (err);
					return;
				} 

				if (cus){

					res.json ({data: {message: 'success'}});
				}
				else{
					next ();
				}
				
			});
		})
	}

	this.checkoutGroup = function(req, res, next){
		var leader = req.body.data[0]
		var members = req.body.data.slice(1)
		var membersId = members.map(function(ele){
			return ele._id
		})
		var memberCusId = members.map(function(ele){
			return ele.customer._id
		})
		
		var total = leader.total;
		var paid = leader.total;
		var usage = leader.usage;
		var oriUsage = leader.oriUsage;
		var price = leader.price;
		var checkoutTime = leader.checkoutTime;
		var promocodes = leader.promocodes;
		var paymentMethod = leader.paymentMethod ? leader.paymentMethod : [];
		var note = leader.note ? leader.note : ''; // optional
		var status = 2;

		paymentMethod.map (function (x, i, arr){
			paid = paid - x.paidTotal;
		});

		Customers.findOneAndUpdate({_id:leader.customer._id}, {$set:{checkinStatus:false}}, function(err, cus){
			if (err){
				next (err)
				return
			}
			else{
				var updateOcc = {
					status: status, 
					total: total, 
					paid: paid,
					usage: usage, 
					oriUsage: oriUsage,
					price: price,
					promocodes: promocodes,
					checkoutTime: checkoutTime,
					paymentMethod: paymentMethod,
					note: note
				}
				
				Occupancies.findOneAndUpdate ({_id: leader._id}, {$set: updateOcc}, {new: true, fields: {updatedAt: 0, orders: 0, staffId: 0, location: 0, createdAt: 0, bookingId: 0}}, function (err, occ){
					if (err){
						next (err)
						return
					}

					if (occ){
						// update acc if being used
						// At this moment. Only one method is used at a time
						if (occ.paymentMethod && occ.paymentMethod.length){
							var acc;
							occ.paymentMethod.map (function (x, i, arr){
								if (x.name == 'account'){
									acc = x;
								}
							});

							if (acc){
								Accounts.findOneAndUpdate ({_id: acc._id}, {$inc: {amount: - acc.paidAmount}}, function (err, foundAcc){
									if (err){
										console.log (err);
										next (err);
										return
									}

									Customers.update({'_id':{$in:memberCusId}}, {$set:{checkinStatus:false}}, {multi: true},function(err, cus){
										if(err){
											next(err)
											return
										}else{

											var updateOccMember = {
												status:status,
												total: 0, 
												paid: 0,
												usage: usage, 
												oriUsage: oriUsage,
												price: price,
												checkoutTime: checkoutTime,
												note: note
											}
											Occupancies.update({'_id':{$in:membersId}}, {$set: updateOccMember}, {new: true, multi: true, fields: {updatedAt: 0, orders: 0, staffId: 0, location: 0, createdAt: 0, bookingId: 0}}, function(err, occ){
												if(err){
													next(err)
													return
												}else{
													res.json ({data: {message: 'success'}});
												}
											})
										}
									})
								});
							}
						}
						else{
							Customers.update({'_id':{$in:memberCusId}}, {$set:{checkinStatus:false}},{multi: true}, function(err, cus){
								if(err){
									next(err)
									return
								}else{

									var updateOccMember = {
										status:status,
										total: 0, 
										paid: 0,
										usage: usage, 
										oriUsage: oriUsage,
										price: price,
										// promocodes: promocodes,
										checkoutTime: checkoutTime,
										// paymentMethod: paymentMethod,
										note: note
									}
									Occupancies.update({'_id':{$in:membersId}}, {$set: updateOccMember}, {new: true, multi: true, fields: {updatedAt: 0, orders: 0, staffId: 0, location: 0, createdAt: 0, bookingId: 0}}, function(err, occ){
										if(err){
											next(err)
											return
										}else{
											res.json ({data: {message: 'success'}});
										}
									})
								}
							})
						}
					}
					else{
						next ();
					}

				})
			}
		})
	}
};