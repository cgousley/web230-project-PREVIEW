var usersModel = require('../../models').Users;
var ordersModel = require('../../models').Orders;
var ProductsModel = require('../../models').Products;
var ObjectId = require('mongoose').Types.ObjectId;
// PostSchema.plugin(deepPopulate, options /* more on options below */);

module.exports = {
      index: function(req, res){
        /*CHECKS TO SEE IF THE SUCCESS PROPERTY IS IN THE SESSION OBJECT.  IF SO MOVE ON, IF NOT DON'T*/
        if(req.session.success && req.session.admin){
        	
        	
        	usersModel.find({}).
			select({fname: 1, lname:1, _id: 1}).
			exec(function(err, users){
				if(err){
					console.log(err);
				}
				else{
				 	res.render('admin/checkOrders',{title: 'Shopping Cart - Admin Check Orders', heading: 'View Customers', user: users, adminHead: true, admin: true, customerDescriptions: true});
				
					if(err){
						console.log(err);
					}
				
				}
			});	
    
       	}
       	
       	//If session is success but privlege is user, redirect to 401
        else if(req.session.success && req.session.user){
        	// res.render('views/401', {nav: true, subtitle: " - Page Not Found", image: "https://httpstatusdogs.com/img/401.jpg",  text: "<p class='lead text-center top20'>You're not authorized to view this page.</br>"+"But you're not stuck! Our navigation bar is above!</p>"});
        	   res.redirect('../401');  
        }
        
        
       	else{
            /* I HAD TO USE A REDIRECT HERE.  IN ORDER TO PASS AN ERROR MESSAGE I ADDED THE ERROR=1 PARAMETER */
            res.redirect('/admin/login/?error=1');
           }
   },


showUserTable: function (req, res) {
    	
    	

    	data = req.body.data;
    	data = JSON.parse(data);
    	 var customer_id = data.group_id;


    	
    	    	ordersModel.find({'orderInfo.customer_id': data.group_id}, function(err, ordersList){
    	    		if(err){
    	    			console.log(err);
    	    		}
    	    		else{
    	    			var table = createOrdersListTable(ordersList);
    	    			res.send(table);
    	    		}
    	    	});

      
    },
    
    

 	


showOrderTable: function (req, res) {
    	data = req.body.data;
    	data = JSON.parse(data);
    	 var customer_id = data.group_id;
    	    	ordersModel.find({'_id': data._id}, function(err, orderDetailList){
    	    		if(err){
    	    			console.log(err);
    	    		}
    	    		else{
    	    			var table = createDetailListTable(orderDetailList);
    	    			res.send(table);
    	    		}
    	    	});
      
    }
}

createDetailListTable = function(data){

		var len = data[0].itemInfo.length;
		var i = 0;
		var table = '<table class="table table-striped table-bordered">';
		table += '<thead>';
		table += '<tr>';
		table += '<th>Product ID</th><th>Product Name</th><th>Count</th><th>Price</th><th>Total</th>';
		table += '</tr></thead><tbody>';
	
		while(i < len){
			table += '<tr>';
						table += '<td>'+data[0].itemInfo[i]._id+'</td>';
						table += '<td>'+data[0].itemInfo[i].name+'<span style="padding: 0px 5px; color: red;">'+data[0].itemInfo[i].removed+'</span></td>';
						table += '<td>'+data[0].itemInfo[i].count+'</td>';
						table += '<td>'+data[0].itemInfo[i].price+'</td>';
						table += '<td>'+data[0].itemInfo[i].total+'</td>';
			
			table += '</tr>';
			i++;
		}
		table += '<tr>';
		table += '<td colspan="3"></td><td>Grand Total</td><td>'+data[0].orderInfo[0].grandTotal+'</td>';
		table += '</tr>';
		table += '</tbody></table>';
		return table;
	


}

createOrdersListTable = function(data){
	if(data.length !== 0){
		
		var len = data.length;
		var i = 0;
		var table = '<table class="table table-striped table-bordered">';
		table += '<thead>';
		table += '<tr>';
		table += '<th>Date and Time</th><th>Order Number</th><th>Get Details</th>';
		table += '</tr></thead><tbody>';
	
		while(i < len){
			table += '<tr>';
			table += '<td>'+data[i].orderInfo[0].date+'</td>';
			table += '<td>'+data[i]._id+'</td>';
			table += '<td><button class="btn btn-primary">Details</button></td>';
			table += '</tr>';
			i++;
		}
		table += '</tbody></table>';
		return table;
		
	}
	
	else {
		var table = "<p class='lead'>No Orders Available.</p>"; 
		return table;
	}

}