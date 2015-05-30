var expect = chai.expect;
var assert = chai.assert;

var Utils = {

    elementContainer: undefined,

    _init: function(){
        this.elementContainer = document.createElement('div');
        this.elementContainer.setAttribute('data-element-container', '');
        this.elementContainer.style.display = 'none';
        document.body.appendChild(this.elementContainer);
        return this;
    },

    append: function(selector, html){
        var div = document.createElement('div');
        div.innerHTML = html;
        var children = Array.prototype.slice.call(div.childNodes);
        var length = children.length;
        var parents = document.querySelectorAll(selector);
        for(var p=0; p<parents.length; p++){
            var parent = parents[p];
            while(children.length){
                var child = children.pop();
                parent.appendChild(child);
            }
        }
    },

    remove: function(parentSelector, childSelector){
        var parents = document.querySelectorAll(parentSelector);
        for(var p=0; p<parents.length; p++){
            var parent = parents[p];
            var children = parent.querySelectorAll(childSelector);
            children = Array.prototype.slice.call(children);
            while(children.length){
                var child = children.pop();
                parent.removeChild(child);
            }
        }
    }

}._init();