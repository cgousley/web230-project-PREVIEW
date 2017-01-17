var userModel = require('../../models').Users;
var ordersModel = require('../../models').Orders;
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = {
	
	// Checkout Page First load
		index: function(req, res, input){
			

	// Is the Person logged in already? If so, load the checkout page
		if(req.session.success && req.session.user){
			res.render('user/checkout',{title: 'Shopping Cart - Checkout', heading: 'Checkout Page', cart: true, userHead: true, ackMessage: true}
		);
		
		}
	
	// If person is not logged in, redirect to login
		else {
			res.redirect('../../login');
 		}
 },
 
 //This sends address stored in session object to user
 loadAddress: function(req,res){

	console.log(JSON.stringify(req.session.user));
	
	res.send(req.session.user);




 }, 

// This completes the checkout
completeCheckout: function(req,res){


        res.send('success');

}

 


}
