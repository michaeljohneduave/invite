Meteor.startup(function () {
	if (Meteor.users.find().count()) {
		Roles.createRole("Admin");
		Roles.createRole("Users");

		var adminUid = Accounts.createUser({
			username : 'admin',
			password : 'qwerty'
		}) 

		Roles.addUsersToRole(uid ,'Admin');
	}
}) 