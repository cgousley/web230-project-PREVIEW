var fs = require('fs');
var Product_GroupsModel = require('../../models').Product_Groups;
var ProductsModel = require('../../models').Products;
var ordersModel = require('../../models').Orders;
var productDetails = [];

module.exports = {
	/*LOGIN PAGE FIRST LOAD*/
     index: function(req, res){
        var url = require('url');
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
          
        /*IF THE PERSON IS ALREADY LOGGED IN AND THEY GOT TO THIS PAGE, THEN LOAD PAGE AND GATHER LIST OF PRODUCT GROUPS FOR DROPDOWN*/
        if(req.session.success && req.session.admin){
             
        	Product_GroupsModel.find({}).
			select({group_name: 1, group_id: 1}).
			exec(function(err, productGroups){
				if(err){
					console.log(err);
				}
				else{
					res.render('admin/updateProduct',{title: 'Shopping Cart - Admin Update Product', heading: 'Update Product(s)', admin: true, group: productGroups, adminHead: true, textVal: true, ackMessage: true});
          		}
           	});
           /*IF THERE IS AN ERROR PARAMETER PASSED WITH THE VALUE OF 1 THEN DISPLAY AN ERROR MESSAGE AND SHOW THE LOGIN PAGE.*/
		}
		
		//If session is success but privlege is user, redirect to 401
        else if(req.session.success && req.session.user){
        	   res.redirect('../401'); 
        }
        
        	//NOT LOGGED IN AT ALL, SEND TO ADMIN LOGIN PAGE
		else {
	      	error = "You do not have access to the admin area";
	      	res.render('admin/login',{error: error, title: 'Shopping Cart - Admin Login', blankBar: true, adminHead: true})
        }
	},
     
//  THIS CREATES LIST OF PRODUCTS FOR DROPDOWN QUERY     
 showProductTable: function (req, res) {
    	data = JSON.parse(req.body.data);
    	
    	console.log("data is "+JSON.stringify(data.group_id));
    	
    	ProductsModel.find({group_id: data.group_id, "removed" : {$ne: "PRODUCT REMOVED"}}).
						select({fragrance: 1, price: 1, group_id: 1, _id: 1, description: 1, image_path: 1}).
						exec(function(err, productDetails){
							var table = createUpdateProductTable(productDetails);
	// CREATE THE NEW TABLE BASED UPON THE DATABASE QUERY AND SEND 
							res.send(table);
		    			});
      
   },
   
// GATHERS PRODUCT INFORMATION TO SEND TO USER SO HE/SHE CAN UPDATE   
getProduct2Update: function(req, res){
          

          
          //IF THE USER IS ALREADY LOGGED IN, HE/SHE MAY PROCEED  
          if(req.session.success){
            
             		
             		var productData = {}
					productData._id = req.body._id;

                 	data = JSON.parse(req.body.data);
    	
    	
    	
    	
    	
    	ProductsModel.find(data).
						select({fragrance: 1, price: 1, group_id: 1, image_path: 1, description: 1, _id: 1}).
						exec(function(err, productDetails){
							
							// /* CREATE THE NEW TABLE BASED UPON THE DATABASE QUERY */
							res.send(productDetails);
		    			});
              
             
           }
           /*IF //IF THE USER IS NOT LOGGED IN, THERE IS AN ERROR PARAMETER PASSED WITH THE VALUE OF 1 THEN DISPLAY AN ERROR MESSAGE AND SHOW THE LOGIN PAGE.*/
          else {
              error = "You do not have access to the admin area";
              res.render('admin/login',{error: error, title: 'Shopping Cart - Admin Login', blankBar: true, adminHead: true})
           }
          
     },

//THIS UPDATES THE PRODUCT     
updateProduct: function(req, res){
    	

    				res.send('success');
    			
    	

},
     

//THis removes the product by adding "removed : PRODUCT REMOVED" to the product occurences in the orders and product collections in the DB
//Then, it queries the db for all products that don't have "removed : PRODUCT REMOVED", creates a table, and sends it to the user as the updated product table  
deleteProduct: function (req, res){

						ProductsModel.find({group_id: data.group_id, "removed" : {$ne: "PRODUCT REMOVED"}}). 
						select({fragrance: 1, price: 1, group_id: 1, _id: 1, description: 1, image_path: 1}).
						exec(function(err, productDetails){

							// creates new table and sends it							
							var table = createUpdateProductTable(productDetails);
							res.send(table);
		    			});
			
					
	
},     
     
         
    

}

createUpdateProductTable = function(data){
	var len = data.length;
	var i = 0;
	var table = '<table class="table table-striped table-bordered">';
	table += '<thead>';
	table += '<tr>';
	table += '<th>Product Name</th><th>Update Product</th><th>Delete Product</th><th style="display: none">Data ID</th>';//<th style="display: none">Data Image</th>
	table += '</tr></thead><tbody>';

	while(i < len){
		table += '<tr>';
		table += '<td>'+data[i].fragrance+' '+data[i].group_id+'</td>';
		table += '<td><button class="btn btn-primary" form="'+data[i]._id+'">Update Product</button></td>';
		table += '<td><button class="btn btn-success">Delete Product</button></td>';
		table += '<td style="display: none">'+data[i]._id+'</td>';
		table += '<td style="display: none">'+data[i].image_path+'</td>';
		table += '</tr>';
		i++;
	}
	table += '</tbody></table>';
	return table;
}