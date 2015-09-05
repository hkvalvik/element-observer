var ObserverData = function(options){

    return {

        options: utils.extend(
            {
                mutations: null,
                event: null
            },
            options
        ),

        types: [],

        _init: function(){
            this.types = this._getTypes();
            return this;
        },

        _getTypes: function(){
            var types = [];
            types = types.concat(this._getMutationsTypes());
            types = types.concat(this._getEventType());
            return types;
        },

        _getMutationsTypes: function(){
            var mutations = this.options.mutations || [];
            var types = [];
            mutations.forEach(function(mutation){
                if(this._mutationContainsAdded(mutation) && types.indexOf('added') === -1){
                    types.push('added');
                }
                if(this._mutationContainsRemoved(mutation) && types.indexOf('removed') === -1){
                    types.push('removed');
                }
                if(this._mutationContainsAttributes(mutation) && types.indexOf('attributes') === -1){
                    types.push('attributes');
                }
            }.bind(this));
            return types;
        },

        _getEventType: function(){
            if(this.options.event){
                return this.options.event.type;
            }
            return [];
        },

        _mutationContainsAdded: function(mutation){
            return mutation.addedNodes.length;
        },

        _mutationContainsRemoved: function(mutation){
            return mutation.removedNodes.length;
        },

        _mutationContainsAttributes: function(mutation){
            return mutation.type == 'attributes';
        },

        //
        // Public
        //

        hasType: function(type){
            return this.types.indexOf(type) !== -1;
        },

        getAttributeChanges: function(attributes){
            var mutations = this.options.mutations;
            var changes = [];
            for(var m=0; m<mutations.length; m++){
                var mutation = mutations[m];
                if(mutation.type == 'attributes' && attributes.indexOf(mutation.attributeName) !== -1){
                    changes.push({
                        target: mutation.target,
                        attributeName: mutation.attributeName,
                        oldValue: mutation.oldValue
                    });
                    /*
                    var elements = this._elements.map(this._getElement.bind(this));
                    if(elements.indexOf(mutation.target) !== -1){
                        changes.push({
                            target: mutation.target,
                            attributeName: mutation.attributeName,
                            oldValue: mutation.oldValue
                        });
                    }
                    */
                }
            }
            return changes;
        },

        getAddedElements: function() {
            return this._getMutatedElements('addedNodes');
        },

        getRemovedElements: function(){
            return this._getMutatedElements('removedNodes');
        },

        //
        // Helpers
        //

        _getMutatedElements: function(property){
            var elements = [];
            var mutations = this.options.mutations;
            for(var m=0; m<mutations.length; m++){
                var mutation = mutations[m];
                var nodes = mutation[property];

                if(property == 'removedNodes'){

                    var doc = document.implementation.createDocument ('http://www.w3.org/1999/xhtml', 'html', null);
                    var html = document.createElementNS('http://www.w3.org/1999/xhtml', 'html');
                    doc.documentElement.appendChild(html);
                    //var body = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');
                    //body.setAttribute('id', 'abc');
                    var body = doc.createElement('body');
                    html.appendChild(body);

                    var target = mutation.target.cloneNode(false);
                    body.appendChild(target);

                    //var targetClone = target.cloneNode(false);
                }


                if(nodes){
                    for(var n=0; n<nodes.length; n++){
                        var node = nodes[n];


                        if(property == 'removedNodes'){
                            node = target.appendChild(node);
                            //console.log("___", node)
                        }


                        if(node.nodeType == Node.ELEMENT_NODE){
                            elements.push(node);

                            if(node.childElementCount > 0){
                                var children = node.querySelectorAll('*');
                                for(var c=0; c<children.length; c++){
                                    var child = children[c];
                                    child.nodeType == Node.ELEMENT_NODE && elements.push(child);
                                }
                            }
                        }
                    }
                }
            }
            return elements;
        }

    }._init();
};
