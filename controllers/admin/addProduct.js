var fs = require('fs');
var Product_GroupsModel = require('../../models').Product_Groups;
var ProductsModel = require('../../models').Products;


module.exports = {
	/*ADD PRODUCT PAGE FIRST LOAD*/
     index: function(req, res){
        var url = require('url');
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
          
        /*IF THE PERSON IS ALREADY LOGGED IN AS AN ADMIN, THEY ARE DIRECTED TO ADD PRODUCT PAGE*/
        if(req.session.success && req.session.admin){
             
        	Product_GroupsModel.find({}).
			select({group_name: 1, group_id: 1}).
			exec(function(err, productGroups){
				if(err){
					console.log(err);
				}
				else{
					res.render('admin/addproduct',{title: 'Shopping Cart - Admin Add Product', heading: 'Add Product', group: productGroups, admin: true, adminHead: true, textVal: true, ackMessage: true});
          		}
           	});
           /*IF THERE IS AN ERROR PARAMETER PASSED WITH THE VALUE OF 1 THEN DISPLAY AN ERROR MESSAGE AND SHOW THE LOGIN PAGE.*/
		}
		//If session is success but privlege is user and not admin, redirect to 401
        else if(req.session.success && req.session.user && !req.session.admin){
        	   res.redirect('../401'); 
        }	
		else {
	      	error = "You do not have access to the admin area";
	      	res.render('admin/login',{error: error, title: 'Shopping Cart - Admin Login', blankBar: true, adminHead: true})
        }
	},
    
    /* This gets the image path for the add product image function */   
    getPath: function(req, res){
    	
    	data = JSON.parse(req.body.data);
    	
    	
    	Product_GroupsModel.find(data).
			select({image_path: 1}).
			exec(function(err, groupPath){
				if(err){
					console.log(err);
				}
				else{
					res.send(groupPath);
          		}
           	});
    	
    	
    	
    },
    
    
     /*This is the add product function*/
    addProduct: function(req, res){

		res.send('success');
		
	},
 		
		

 	
 	

 	}