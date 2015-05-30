describe('Removed', function(){

    it('should ignore previously removed elements, even synchronously', function(done){
        Utils.append(
            '[data-element-container]',
            '<div class="yellow-sync yellow-sync-1"></div>' +
            '<div class="yellow-sync yellow-sync-2"></div>' +
            '<div class="yellow-sync yellow-sync-3"></div>'
        );
        Utils.remove('[data-element-container]', '.yellow-sync-1');
        Utils.remove('[data-element-container]', '.yellow-sync-2');
        elementObserver('body .yellow-sync').removed(function(elements){
            throw new Error('Did not expect any elements');
        });
        done();
    })

    it('should return elements removed synchronously', function(done){
        Utils.append(
            '[data-element-container]',
            '<div class="blue-sync blue-sync-1"></div>' +
            '<div class="blue-sync blue-sync-2"></div>' +
            '<div class="blue-sync blue-sync-3"></div>'
        );
        elementObserver('body .blue-sync').removed(function(elements){
            assert.equal(elements.length, 2);
            assert.equal(elements[0].getAttribute('class'), 'blue-sync blue-sync-2');
            assert.equal(elements[1].getAttribute('class'), 'blue-sync blue-sync-1');
            done();
        });
        Utils.remove('[data-element-container]', '.blue-sync-1');
        Utils.remove('[data-element-container]', '.blue-sync-2');
    })

    it('should return elements removed asynchronously', function(done){
        Utils.append(
            '[data-element-container]',
            '<div class="blue-async blue-async-1"></div>' +
            '<div class="blue-async blue-async-2"></div>' +
            '<div class="blue-async blue-async-3"></div>'
        );
        elementObserver('body .blue-async').removed(function(elements){
            assert.equal(elements.length, 2);
            assert.equal(elements[0].getAttribute('class'), 'blue-async blue-async-2');
            assert.equal(elements[1].getAttribute('class'), 'blue-async blue-async-1');
            done();
        });
        setTimeout(function(){
            Utils.remove('[data-element-container]', '.blue-async-1');
            Utils.remove('[data-element-container]', '.blue-async-2');
        }, 1);
    })

    it('should return a long list of deeply nested removed elements', function(done){
        var start = '';
        var lis = '';
        var end = '';
        var i;
        for(i=0; i<100; i++){ start += '<div>'; }
        for(i=0; i<100; i++){ lis += '<li><a href="#test">Test</a></li>'; }
        for(i=0; i<100; i++){ end += '</div>'; }
        Utils.append(
            '[data-element-container]',
            '<div data-temporary>' + start + '<ul>' + lis + '</ul>' + end + '</div>'
        );
        elementObserver('a[href="#test"]').removed(function(elements){
            assert.equal(elements.length, 100);
            done();
        });
        Utils.remove(
            '[data-element-container]',
            '[data-temporary]'
        );
    })

})
