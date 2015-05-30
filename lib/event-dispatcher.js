var EventDispatcher = function(){
    return {
        _eventCallbacks: [],

        on: function(eventName, callback){
            this._eventCallbacks.push({eventName: eventName, callback: callback});
        },

        trigger: function(eventName){
            // Convert to array and remove eventName argument
            var args = Array.prototype.slice.call(arguments, 1);

            for(var c=0; c<this._eventCallbacks.length; c++){
                var eventCallback = this._eventCallbacks[c];
                if(eventCallback.eventName == eventName){
                    eventCallback.callback.apply(this, args);
                }
            }
        },

        hasEventListener: function(name){
            for(var c=0; c<this._eventCallbacks.length; c++){
                var eventCallback = this._eventCallbacks[c];
                if(eventCallback.eventName == name){
                    return true;
                }
            }
            return false;
        }
    }
}
