describe('Added', function(){

    /*
    it('should ignore previously added elements, even synchronously', function(done){
        Utils.append(
            '[data-element-container]',
            '<div class="orange"></div>' +
            '<div class="orange"></div>' +
            '<div class="orange"></div>'
        );
        elementObserver('body .orange').added(function(elements){
            console.error('Added: Did not expect any elements');
            throw new Error('Did not expect any elements');
        });
        done();
    })
    */

    it('should return elements added synchronously', function(done){
        elementObserver('body .red').added(function(elements){
            assert.equal(elements.length, 3);
            assert.equal(elements[0].getAttribute('class'), 'red');
            done();
        });
        Utils.append(
            '[data-element-container]',
            '<div class="red"></div>' +
            '<div class="red"></div>' +
            '<div class="red"></div>'
        );
    })

    it('should return elements added asynchronously', function(done){
        elementObserver('body .green').added(function(elements){
            assert.equal(elements.length, 3);
            assert.equal(elements[0].getAttribute('class'), 'green');
            done();
        });
        setTimeout(function(){
            Utils.append(
                '[data-element-container]',
                '<div class="green"></div>' +
                '<div class="green"></div>' +
                '<div class="green"></div>'
            );
        }, 1);
    })

    it('should return elements with complex selectors', function(done){
        elementObserver('html body #test-id.test-class:first-child').added(function(elements){
            assert.equal(elements.length, 1);
            done();
        });
        Utils.append(
            '[data-element-container]',
            '<div><a id="test-id" class="test-class"></a></div>'
        );
    })

    it('should return a long list of deeply nested elements', function(done){
        var start = '';
        var lis = '';
        var end = '';
        var i;
        for(i=0; i<100; i++){ start += '<div class="abc">'; }
        for(i=0; i<100; i++){ lis += '<li><a href="#test">Test</a></li>'; }
        for(i=0; i<100; i++){ end += '</div>'; }
        elementObserver('a[href="#test"]').added(function(elements){
            assert.equal(elements.length, 100);
            done();
        });
        Utils.append(
            '[data-element-container]',
            start + '<ul>' + lis + '</ul>' + end
        );
    })

})
