// Create an observer

var observer = new Observer();

// Start listening for observer events

observer.connect();

// Public API

/**
 * @param {String} selector A selector that will be passed on to document.querySelectorAll
 * @returns {Object} Chainable methods
 * @constructor
 */
window.elementObserver = function(selector){

    // Create a new query that uses the observer to detect changes to elements that match the query.

    var query = Query.register(selector, observer);

    return {

        find: function(callback){
            callback(query.find());
            return this;
        },

        added: function(callback){
            query.on(EventNames.ADDED, callback);
            return this;
        },

        removed: function(callback){
            query.on(EventNames.REMOVED, callback);
            return this;
        },

        attribute: function(attributes, callback){
            query.watchAttributes(attributes);
            query.on(EventNames.ATTRIBUTES, function(changes){
                var filtered = changes.filter(function(change){
                    return attributes.indexOf(change.attributeName) !== -1
                });
                filtered.length && callback(filtered);
            });
            return this;
        },

        changed: function(properties, callback){
            query.elementList.watchProperties(properties);
            query.elementList.on(EventNames.CHANGED, function(changes){
                var filtered = changes.filter(function(change){
                    for(var i=0; i<change.items.length; i++){
                        if(properties.indexOf( change.items[i].property ) !== -1){
                            return change;
                        }
                    }
                    return false;
                });

                filtered.length && callback(filtered);
            });
            return this;
        }
    };
};

// Static API

elementObserver.connect = observer.connect.bind(observer);

elementObserver.disconnect = observer.disconnect.bind(observer);
