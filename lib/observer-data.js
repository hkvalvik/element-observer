var ObserverData = function(options){

    return {

        options: utils.extend(
            {
                mutations: null,
                event: null
            },
            options
        ),

        _types: [],

        _init: function(){
            this._types = this._getTypes();
            return this._serialize();
        },

        _serialize: function(){
            return utils.extend(
                {
                    hasType: this._hasType.bind(this)
                },
                this.options
            );
        },

        _getTypes: function(){
            var types = [];
            types = types.concat(this._getMutationsTypes());
            if(this.options.event){} // TODO
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

        _mutationContainsAdded: function(mutation){
            return mutation.addedNodes.length;
        },

        _mutationContainsRemoved: function(mutation){
            return mutation.removedNodes.length;
        },

        _mutationContainsAttributes: function(mutation){
            return mutation.type == 'attributes';
        },

        _hasType: function(type){
            return this._types.indexOf(type) !== -1;
        }

    }._init();
};