'use strict';

// Declare app level module which depends on views, and core components
    angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'ui.router'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});

}]).
run(['$window','$uiRouter','$trace',function ($window, $uiRouterProvider,$trace) {
    var StickyStatesPlugin = $window['@uirouter/sticky-states'].StickyStatesPlugin;
    $uiRouterProvider.plugin(StickyStatesPlugin);

    var DSRPlugin = $window['@uirouter/dsr'].DSRPlugin;
    $uiRouterProvider.plugin(DSRPlugin);

    var VisualizerPlugin = $window['@uirouter/visualizer'].Visualizer;
    $uiRouterProvider.plugin(VisualizerPlugin);

    $trace.enable();
}])
.config(function ($uiRouterProvider ) {

    // Add states
    var stateRegistry = $uiRouterProvider.stateRegistry;
    // stateRegistry.stateQueue.flush()

    stateRegistry.register({
        name: "parent",
        url: "/parent",
        sticky: true,
        template: "<br><br><div ui-view='view1'></div><div ui-view='viewTemp'></div><div ui-view='view2'></div>"
    });

    stateRegistry.register({
        name: "parent.sticky1",
        url: "/parent/sticky1",
        sticky: true,
        dsr:true,
        views: {
            "view1": {
                templateUrl: 'view1/Sticky1.html'
            }
        }
    });

    stateRegistry.register({
        name: "parent.sticky1.childSticky1",
        url: "/parent/sticky1/childSticky1",
        sticky:true,
        dsr:true,
        views: {
            "childSticky1": {
                templateUrl: 'view1/childSticky1.html'
            }
        }
    });

    stateRegistry.register({
        name: "parent.sticky1.childSticky1.lastchildSticky1",
        url: "/parent/sticky1/childSticky1/lastchildSticky1",
        sticky:true,
        dsr:true,
        views: {
            "lastchildSticky1": {
                template: "<div style='border: 2px solid #FF6347;'>last child Sticky1 <b>1</b><br>Following last child Sticky1 text should persist:<br><textarea></textarea></div>"
            }
        }
    });

    stateRegistry.register({
        name: "parent.sticky1.childSticky2",
        url: "/parent/sticky1/childSticky2",
        sticky:true,
        dsr:true,
        views: {
            "childSticky2": {
                template: "<div style='border: 2px solid #00FF00;'>child Sticky2 <b>2</b><br>Following child Sticky2 text should persist:<br><textarea></textarea></div>"
            }
        }
    });

    stateRegistry.register({
        name: "parent.sticky2",
        url: "/parent/sticky2",
        sticky: true,
        dsr:true,
        views: {
            "view2": {
                templateUrl: 'view1/Sticky2.html'
            }
        }
    });

    stateRegistry.register({
        name: "parent.stickyTemp",
        url: "/parent/stickyTemp",
        // sticky: true,
        // dsr:true,
        views: {
            "viewTemp": {
                templateUrl: 'view1/stickyTemp.html'
            }
        }
    });

    stateRegistry.register({
        name: "parent.sticky2.child1Sticky2",
        url: "/parent/sticky2/child1Sticky2",
        sticky:true,
        dsr:true,
        views: {
            "child1Sticky2": {
                template: "<div style='border: 2px solid #00FF00;'>child 1 Sticky 2 <br>Following child 1 Sticky2 text should persist:<br><textarea></textarea> <div ui-view='lastchild1Sticky2'></div></div>"
            }
        }
    });

    stateRegistry.register({
        name: "parent.sticky2.child1Sticky2.lastchild1Sticky2",
        url: "/parent/sticky2/child1Sticky2/lastchild1Sticky2",
        sticky:true,
        dsr:true,
        views: {
            "lastchild1Sticky2": {
                template: "<div style='border: 2px solid #FF6347;'>last child Sticky1 <b>1</b><br>Following last child Sticky1 text should persist:<br><textarea></textarea></div>"
            }
        }
    });

    stateRegistry.register({
        name: 'home',
        url: '/home',
        sticky: true,
        views: {
            "home":{
                template: "<h1>Home</h1>"
            }
        }

    });


    // Set initial state
    var urlService = $uiRouterProvider.urlService;
    urlService.rules.initial({ state: 'home' });
})
.provider('stateQueue', ['$stateProvider', function($stateProvider){
    this.$get = [function(){
        return $stateProvider.stateRegistry.stateQueue;
    }];
}])
// Generic component
.component('generic', {
    bindings: { '$state$': '<' },
    controller: 'MainCtrl'
})

.controller('MainCtrl', function MainCtrl($state,stateQueue, $stateRegistry ) {
    this.hero = {
        name: 'Spawn'
    };
    this.change = function () {
        var state = $state;
    };
    this.goToParent = function () {
        // console.log($element);
        // $element.empty();
        // var currentState = $state.current;
        // stateQueue.flush(currentState);
        // delete stateQueue.states["parent.sticky1.childSticky1"];
        // $stateRegistry.deregister($state.current);

        stateQueue.states["parent.sticky1.childSticky1"] = stateQueue.states["parent.sticky1"];
        $state.go('parent.sticky1');
        // $state.go('parent.stickyTemp');
    };
    this.goToTarget = function () {
        $state.go('parent.sticky1',null,{supercede:false});
    };
})

.run(function ($state, $rootScope) {
    $rootScope.$state = $state;
});

