# Element Observer

Observe elements

## Examples

### Observe added elements

	// Observe
	
	elementObserver('.my-selector').added(function(elements){
		console.log(elements);
	});

	// Then add element(s)
	
	var element = document.createElement('div');
	element.className = 'my-selector';
	document.body.appendChild(element);

### Observe removed elements

	// Observe
	
	elementObserver('.my-selector').removed(function(elements){
		console.log(elements);
	});

	// Then remove element(s)
	
	var element = document.querySelector('.my-selector');
	document.body.removeChild(element);

### Get existing elements

	// Add element(s)
	
	var element = document.createElement('div');
	element.className = 'my-selector';
	document.body.appendChild(element);
	
	// Observe
	
	elementObserver('.my-selector').find(function(elements){
		console.log(elements);
	});

### Behind the scenes
	
* Uses [`MutationObserver`](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) and [`window resize`](https://developer.mozilla.org/en-US/docs/Web/Events/resize) to track changes to the DOM.

