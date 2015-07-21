Licenses = new Mongo.Collection("licenses");

Meteor.methods({
	addLicense: function(name, customer) {
		Licenses.insert({
			name: name,
			customer: customer
		});
	},
	deleteLicense: function(licenseId) {
		Licenses.remove(licenseId);
	}
});

if (Meteor.isClient) {

	Meteor.subscribe("licenses");
	Meteor.subscribe("users");
	
	Template.body.helpers({
		licenses: function() {
			return Licenses.find({});
		}
	});
	
	Template.userinfo.helpers({
		username: function(){
			return Meteor.user().services.google.given_name;
		}
	});
	
	Template.body.events({
		"submit .new-license": function (event) {

		// This function is called when the new task form is submitted
		var name = event.target.name.value;
		var customer = event.target.customer.value;

		Meteor.call("addLicense", name, customer);

		// Clear form
		event.target.name.value = "";
		event.target.customer.value = "";

		// Prevent default form submit
		return false;
	}});
	
	Template.license.events({
		"click .delete": function () {
			Meteor.call("deleteLicense", this._id);
		}
	});
	
}

if (Meteor.isServer) {

	Accounts.config({
		restrictCreationByEmailDomain: 'hansoft.com'
	});

	Meteor.startup(function () {
  // code to run on server at startup
  
  // Remove configuration entries in case service is already configured
  ServiceConfiguration.configurations.remove({
  	$or: [ {service: "google"} ]
  });

  // Add Google configuration entry
  ServiceConfiguration.configurations.insert({
  	"service": "google",
  	"clientId": "576655376462-4jd9b16i1kavg8o787g54fqq6tngecct.apps.googleusercontent.com",
  	"secret": "r1O2wenqKXWV0e2JqIi0dQl5"
  });
  
  
});
	
	Meteor.publish("licenses", function () {
		return Licenses.find();
	});
	
	Meteor.publish("users", function() {
		return Meteor.users.find({});
	});
}
