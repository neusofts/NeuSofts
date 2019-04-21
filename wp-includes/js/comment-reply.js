/**
 * @summary Handles the addition of the comment form.
 *
 * @since 2.7.0
 *
 * @type {Object}
 */
var addComment = {
	/**
	 * @summary Retrieves the elements corresponding to the given IDs.
	 *
	 * @since 2.7.0
	 *
	 * @param {string} commId The comment ID.
	 * @param {string} parentId The parent ID.
	 * @param {string} respondId The respond ID.
	 * @param {string} postId The post ID.
	 * @returns {boolean} Always returns false.
	 */
	moveForm: function( commId, parentId, respondId, postId ) {
		var div, element, style, cssHidden,
			t           = this,
			comm        = t.I( commId ),
			respond     = t.I( respondId ),
			cancel      = t.I( 'cancel-comment-reply-link' ),
			parent      = t.I( 'comment_parent' ),
			post        = t.I( 'comment_post_ID' ),
			commentForm = respond.getElementsByTagName( 'form' )[0];

		if ( ! comm || ! respond || ! cancel || ! parent || ! commentForm ) {
			return;
		}

		t.respondId = respondId;
		postId = postId || false;

		if ( ! t.I( 'wp-temp-form-div' ) ) {
			div = document.createElement( 'div' );
			div.id = 'wp-temp-form-div';
			div.style.display = 'none';
			respond.parentNode.insertBefore( div, respond );
		}

		comm.parentNode.insertBefore( respond, comm.nextSibling );
		if ( post && postId ) {
			post.value = postId;
		}
		parent.value = parentId;
		cancel.style.display = '';

		/**
		 * @summary Puts back the comment, hides the cancel button and removes the onclick event.
		 *
		 * @returns {boolean} Always returns false.
		 */
		cancel.onclick = function() {
			var t       = addComment,
				temp    = t.I( 'wp-temp-form-div' ),
				respond = t.I( t.respondId );

			if ( ! temp || ! respond ) {
				return;
			}

			t.I( 'comment_parent' ).value = '0';
			temp.parentNode.insertBefore( respond, temp );
			temp.parentNode.removeChild( temp );
			this.style.display = 'none';
			this.onclick = null;
			return false;
		};

		/*
		 * Sets initial focus to the first form focusable element.
		 * Uses try/catch just to avoid errors in IE 7- which return visibility
		 * 'inherit' when the visibility value is inherited from an ancestor.
		 */
		try {
			for ( var i = 0; i < commentForm.elements.length; i++ ) {
				element = commentForm.elements[i];
				cssHidden = false;

				// Modern browsers.
				if ( 'getComputedStyle' in window ) {
					style = window.getComputedStyle( element );
				// IE 8.
				} else if ( document.documentElement.currentStyle ) {
					style = element.currentStyle;
				}

				/*
				 * For display none, do the same thing jQuery does. For visibility,
				 * check the element computed style since browsers are already doing
				 * the job for us. In fact, the visibility computed style is the actual
				 * computed value and already takes into account the element ancestors.
				 */
				if ( ( element.offsetWidth <= 0 && element.offsetHeight <= 0 ) || style.visibility === 'hidden' ) {
					cssHidden = true;
				}

				// Skip form elements that are hidden or disabled.
				if ( 'hidden' === element.type || element.disabled || cssHidden ) {
					continue;
				}

				element.focus();
				// Stop after the first focusable element.
				break;
			}

		} catch( er ) {}

		return false;
	},

	/**
	 * @summary Returns the object corresponding to the given ID.
	 *
	 * @since 2.7.0
	 *
	 * @param {string} id The ID.
	 * @returns {Element} The element belonging to the ID.
	 */
	I: function( id ) {
		return document.getElementById( id );
	}
};
nt handler.
	 *
	 * @since 5.1.0
	 *
	 * @param {Event} event The calling event.
	 */
	function cancelEvent( event ) {
		var cancelLink = this;
		var temporaryFormId  = config.temporaryFormId;
		var temporaryElement = getElementById( temporaryFormId );

		if ( ! temporaryElement || ! respondElement ) {
			// Conditions for cancel link fail.
			return;
		}

		getElementById( config.parentIdFieldId ).value = '0';

		// Move the respond form back in place of the temporary element.
		temporaryElement.parentNode.replaceChild( respondElement ,temporaryElement );
		cancelLink.style.display = 'none';
		event.preventDefault();
	}

	/**
	 * Click event handler.
	 *
	 * @since 5.1.0
	 *
	 * @param {Event} event The calling event.
	 */
	function clickEvent( event ) {
		var replyLink = this,
			commId    = getDataAttribute( replyLink, 'belowelement'),
			parentId  = getDataAttribute( replyLink, 'commentid' ),
			respondId = getDataAttribute( replyLink, 'respondelement'),
			postId    = getDataAttribute( replyLink, 'postid'),
			follow;

		if ( ! commId || ! parentId || ! respondId || ! postId ) {
			/*
			 * Theme or plugin defines own link via custom `wp_list_comments()` callback
			 * and calls `moveForm()` either directly or via a custom event hook.
			 */
			return;
		}

		/*
		 * Third party comments systems can hook into this function via the global scope,
		 * therefore the click event needs to reference the global scope.
		 */
		follow = window.addComment.moveForm(commId, parentId, respondId, postId);
		if ( false === follow ) {
			event.preventDefault();
		}
	}

	/**
	 * Creates a mutation observer to check for newly inserted comments.
	 *
	 * @since 5.1.0
	 */
	function observeChanges() {
		if ( ! MutationObserver ) {
			return;
		}

		var observerOptions = {
			childList: true,
			subTree: true
		};

		observer = new MutationObserver( handleChanges );
		observer.observe( document.body, observerOptions );
	}

	/**
	 * Handles DOM changes, calling init() if any new nodes are added.
	 *
	 * @since 5.1.0
	 *
	 * @param {Array} mutationRecords Array of MutationRecord objects.
	 */
	function handleChanges( mutationRecords ) {
		var i = mutationRecords.length;

		while ( i-- ) {
			// Call init() once if any record in this set adds nodes.
			if ( mutationRecords[ i ].addedNodes.length ) {
				init();
				return;
			}
		}
	}

	/**
	 * Backward compatible getter of data-* attribute.
	 *
	 * Uses element.dataset if it exists, otherwise uses getAttribute.
	 *
	 * @since 5.1.0
	 *
	 * @param {HTMLElement} Element DOM element with the attribute.
	 * @param {String}      Attribute the attribute to get.
	 *
	 * @return {String}
	 */
	function getDataAttribute( element, attribute ) {
		if ( supportsDataset ) {
			return element.dataset[attribute];
		}
		else {
			return element.getAttribute( 'data-' + attribute );
		}
	}

	/**
	 * Get element by ID.
	 *
	 * Local alias for document.getElementById.
	 *
	 * @since 5.1.0
	 *
	 * @param {HTMLElement} The requested element.
	 */
	function getElementById( elementId ) {
		return document.getElementById( elementId );
	}

	/**
	 * Moves the reply form from its current position to the reply location.
	 *
	 * @since 2.7.0
	 *
	 * @memberOf addComment
	 *
	 * @param {String} addBelowId HTML ID of element the form follows.
	 * @param {String} commentId  Database ID of comment being replied to.
	 * @param {String} respondId  HTML ID of 'respond' element.
	 * @param {String} postId     Database ID of the post.
	 */
	function moveForm( addBelowId, commentId, respondId, postId ) {
		// Get elements based on their IDs.
		var addBelowElement = getElementById( addBelowId );
		respondElement  = getElementById( respondId );

		// Get the hidden fields.
		var parentIdField   = getElementById( config.parentIdFieldId );
		var postIdField     = getElementById( config.postIdFieldId );
		var element, cssHidden, style;

		if ( ! addBelowElement || ! respondElement || ! parentIdField ) {
			// Missing key elements, fail.
			return;
		}

		addPlaceHolder( respondElement );

		// Set the value of the post.
		if ( postId && postIdField ) {
			postIdField.value = postId;
		}

		parentIdField.value = commentId;

		cancelElement.style.display = '';
		addBelowElement.parentNode.insertBefore( respondElement, addBelowElement.nextSibling );

		/*
		 * This is for backward compatibility with third party commenting systems
		 * hooking into the event using older techniques.
		 */
		cancelElement.onclick = function(){
			return false;
		};

		// Focus on the first field in the comment form.
		try {
			for ( var i = 0; i < commentFormElement.elements.length; i++ ) {
				element = commentFormElement.elements[i];
				cssHidden = false;

				// Get elements computed style.
				if ( 'getComputedStyle' in window ) {
					// Modern browsers.
					style = window.getComputedStyle( element );
				} else if ( document.documentElement.currentStyle ) {
					// IE 8.
					style = element.currentStyle;
				}

				/*
				 * For display none, do the same thing jQuery does. For visibility,
				 * check the element computed style since browsers are already doing
				 * the job for us. In fact, the visibility computed style is the actual
				 * computed value and already takes into account the element ancestors.
				 */
				if ( ( element.offsetWidth <= 0 && element.offsetHeight <= 0 ) || style.visibility === 'hidden' ) {
					cssHidden = true;
				}

				// Skip form elements that are hidden or disabled.
				if ( 'hidden' === element.type || element.disabled || cssHidden ) {
					continue;
				}

				element.focus();
				// Stop after the first focusable element.
				break;
			}
		}
		catch(e) {

		}

		/*
		 * false is returned for backward compatibility with third party commenting systems
		 * hooking into this function.
		 */
		return false;
	}

	/**
	 * Add placeholder element.
	 *
	 * Places a place holder element above the #respond element for
	 * the form to be returned to if needs be.
	 *
	 * @since 2.7.0
	 *
	 * @param {HTMLelement} respondElement the #respond element holding comment form.
	 */
	function addPlaceHolder( respondElement ) {
		var temporaryFormId  = config.temporaryFormId;
		var temporaryElement = getElementById( temporaryFormId );

		if ( temporaryElement ) {
			// The element already exists, no need to recreate.
			return;
		}

		temporaryElement = document.createElement( 'div' );
		temporaryElement.id = temporaryFormId;
		temporaryElement.style.display = 'none';
		respondElement.parentNode.insertBefore( temporaryElement, respondElement );
	}

	return {
		init: init,
		moveForm: moveForm
	};
})( window );
