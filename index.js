
// Create an observer that updates queries every time a DOM change occurs.

var observer = new Observer(function(mutations){
    Query.queries.forEach(updateQuery.bind(this, mutations));
});

function updateQuery(mutations, query){
    query.update(mutations);
}

// Public API

/**
 * @param {String} selector
 * @returns {Object}
 * @constructor
 */
window.elementObserver = function(selector){
    var query = Query.register(selector);

    return {

        // Query

        find: function(callback){
            callback(query.find());
            return this;
        },

        added: function(callback){
            query._updateAddedElements();
            query.on('added', callback);
            return this;
        },

        removed: function(callback){
            query._updateAddedElements();
            query.on('removed', callback);
            return this;
        },

        attribute: function(attributes, callback){
            query._updateAddedElements(); // TODO
            query.watchAttributes(attributes);
            query.on('attribute', function(changes){
                var filtered = changes.filter(function(change){
                    return attributes.indexOf(change.attributeName) !== -1
                });
                filtered.length && callback(filtered);
            });
            return this;
        },

        change: function(properties, callback){
            query._updateAddedElements();
            query.watchProperties(properties);
            query.on('change', function(changes){
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

// Observer

elementObserver.connect = observer.connect.bind(observer);

elementObserver.disconnect = observer.disconnect.bind(observer);
