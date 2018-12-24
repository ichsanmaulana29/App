angular.module('todo',['ngRoute','ngAnimate'])
	.config(function($routeProvider){
	        $routeProvider
	        .when('/',{
	            templateUrl:'views/all.html',
	            controller:'WorkController'
	        })
	        .when('/active',{
	            templateUrl:'views/active.html',
	            controller:'WorkController'
	        })
	        .when('/completed',{
	            templateUrl:'views/completed.html',
	            controller:'WorkController'
	        })
	        .otherwise('/');
	})

	.controller('WorkController',['$scope','DataFactory','$location','$localStorage',function($scope,DataFactory,$location,$localStorage){

       //For id's assigned to the tasks
       var counter=0;

       //Making the correct filter link active from the url
       var initalPath = $location.url().split('/')[1];

        if(initalPath==""){
            $('#filter a').removeClass('active');
            $('#filter a').eq(0).addClass('active');
        }else if(initalPath=="active"){
            $('#filter a').removeClass('active');
            $('#filter a').eq(1).addClass('active');
        }else{
            $('#filter a').removeClass('active');
            $('#filter a').eq(2).addClass('active');
        }

        //Filter Links click event
        $('#filter a').click(function(){
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        });

        //Model View
        $scope.newTask = "";
        $scope.todoList = DataFactory.todoList;
        $scope.checkAll = false;
        $scope.disable = true;
       

        //Add task
        $scope.addTask = function(){
            var newTodo = {
                id:counter,
                description:$scope.newTask.trim(),
                active:true
            };
            DataFactory.todoList.push(newTodo);
            $localStorage.store('tasks',$scope.todoList);
            $scope.newTask = "";
            counter++;
            $scope.checkAll= true;
            $scope.disable = false;
        };

        //Delete task
        $scope.deleteTask = function(index){
            DataFactory.todoList.splice(index,1);
            $localStorage.store('tasks',$scope.todoList);
        };

        //Add new task on pressing enter
        $scope.keyCheck = function($event){
                if($event.keyCode===13 && $scope.newTask!=""){
                    $scope.addTask();
                }
        };

        //Toggle all tasks active/complete when chevron icon is clicked
        $scope.checkTasks = function(){
            if($scope.checkAll===true){
                for (var i = 0; i < $scope.todoList.length; i++) {
                        $scope.todoList[i].active = true;
                }

                $localStorage.store('tasks',$scope.todoList);  

            }else{
                for (var i = 0; i < $scope.todoList.length; i++) {
                        $scope.todoList[i].active = false;
                }//for                

                $localStorage.store('tasks',$scope.todoList);

            }//else
        };

        //Refresh the whole list in todolist data factory
        $scope.refreshTodolist = function(){
            $localStorage.store('tasks',$scope.todoList);
        };


	}])

	//All the to do tasks
	.factory('DataFactory',['$localStorage',function($localStorage){
	    var dataFac={};
	        
	        dataFac.todoList = $localStorage.get('tasks','[]');

	    return dataFac;
	}])

	//HTML5 Local Storage Functionality
	.factory('$localStorage',['$window',function($window){
    return {
        store:function(key,value){
            $window.localStorage[key] = JSON.stringify(value);
        },
        get:function(key,defaultValue){
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
	}])

	//Active Tasks Filter
	.filter('activeFilter',function(){
	    return function(tasks){
	        var out = [];
	        for (var i= 0; i< tasks.length; i++) {
	            if (tasks[i].active === true ){
	                    out.push(tasks[i]);
	                }
	            }
	        return out;

	    };
	})

	//Completed Tasks Filter
	.filter('completedFilter',function(){
	    return function(tasks){
	        var out = [];
	        for (var i= 0; i< tasks.length; i++) {
	                if (tasks[i].active === false ){
	                    out.push(tasks[i]);
	                }
	        }
	        return out;

	    };
	})


;//End angular.module chaining