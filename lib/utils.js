var utils = {

    filterByProperty: function(name, value, object){
        return object[name] == value;
    },

    concatUnique: function(array1, array2){
        for(var i=0; i<array2.length; i++){
            var item = array2[i];
            if(array1.indexOf(item) === -1){
                array1.push(item);
            }
        }
        return array1;
    },

    isInDom: function(node){
        var parent = node;
        while(parent.parentNode){
            parent = parent.parentNode;
        }
        return parent == document;
    },

    requestAnimationFrame: window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        },

    extend: function(target, source) {
        var a = Object.create(target);
        Object.keys(source).map(function (prop) {
            a[prop] = source[prop];
        });
        return a;
    }
};
