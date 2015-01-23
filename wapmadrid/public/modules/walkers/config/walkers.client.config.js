'use strict';

// Configuring the Articles module
angular.module('walkers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Walkers', 'walkers', 'dropdown', '/walkers(/create)?');
		Menus.addSubMenuItem('topbar', 'walkers', 'List Walkers', 'walkers');
		Menus.addSubMenuItem('topbar', 'walkers', 'New Walker', 'walkers/create');
	}
]);