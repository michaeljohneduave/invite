Router.configure({
   // notFoundTemplate: 'notfound404',
    loadingTemplate : 'loading',
});

Router.map(function () {
	this.route('home', {
		path : '/',
		template : 'home',
		action : function () {
			if(!this.ready()) {
				this.render('loading');
			} else {
				this.render();
			}
		}
	})
});

Router.onBeforeAction(function () {
	this.next();
});
