var EventNames = {

    // Mutation-related events

    MUTATION: 'mutation',

    ADDED: 'added',

    REMOVED: 'removed',

    ATTRIBUTES: 'attributes',

    CHANGED: 'changed',

    // Window events

    RESIZED: 'resized',

    // All

    all: [],

    // Init

    _init: function(){
        for(var property in this){
            var value = this[property];
            if(typeof value == 'string'){
                this.all.push(value);
            }
        }
        return this;
    }

}._init();

