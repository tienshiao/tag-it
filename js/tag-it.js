(function($) {

	$.fn.tagit = function (options) {

		var el = this;
		var tags = new Array();

		const BACKSPACE		= 8;
		const ENTER			= 13;
		const SPACE			= 32;
		const COMMA			= 44;

		// add the tagit CSS class.
		el.addClass("tagit");

		// get any current tags. 
		el.find('li').each(function (index) {
			tags[index] = $(this).text();
		});

		// create the input field.
		var html_input_field = '<li class="tagit-new"><input class="tagit-input" type="text" /></li>';
		el.html(html_input_field);

		var tag_input = el.children(".tagit-new").children(".tagit-input");

		// add support for tags already set at page load.
		var i = 0;
		for(i = 0; i < tags.length; i++)
		{
			tags[i] = tags[i].replace(/,+$/,"");
			tags[i] = tags[i].trim();
			
			if (tags[i] != "") {
				if (is_new (tags[i])) {
					create_choice (tags[i]);
				}
				// Cleaning the input.
				tag_input.val("");
			}
		}

		$(this).click(function(e){
			if (e.target.tagName == 'A') {
				// Removes a tag when the little 'x' is clicked.
				// Event is binded to the UL, otherwise a new tag (LI > A) wouldn't have this event attached to it.
				$(e.target).parent().remove();
			}
			else {
				// Sets the focus() to the input field, if the user clicks anywhere inside the UL.
				// This is needed because the input field needs to be of a small size.
				tag_input.focus();
			}
		});

        // fix webkit support for backspace
        tag_input.keydown(function(event){
			if (event.which == BACKSPACE) {
				if (tag_input.val() == "") {
					// When backspace is pressed, the last tag is deleted.
					$(el).children(".tagit-choice:last").remove();
				}
			}
        });

		tag_input.keypress(function(event){
			// Comma/Space/Enter are all valid delimiters for new tags.
			if (event.which == COMMA || event.which == SPACE || event.which == ENTER) {
				event.preventDefault();
                                // We use the blur method instead of check_for_tag. You'll say that its the same thing but this way the autocomplete select box is removed when we hit the ENTER key.
				// check_for_tag();
                                tag_input.blur();
                tag_input.focus();
//                setTimeout(function(){
//                    tag_input.focus();
//                }, 100); 
			}
		});

		tag_input.autocomplete({
			source: options.availableTags, 
			select: function (event,ui) {
				// Delete the last tag if we autocomplete something despite the input being empty
				// This happens because the input's blur event causes the tag to be created when
				// the user clicks an autocomplete item.
				// The only artifact of this is that while the user holds down the mouse button
				// on the selected autocomplete item, a tag is shown with the pre-autocompleted text,
				// and is changed to the autocompleted text upon mouseup.
                                if (tag_input.val() == '') {
                                  $(el).children(".tagit-choice:last").remove();
                                }
				if (is_new(ui.item.value)) {
					create_choice (ui.item.value);
				}
				// Cleaning the input.
				tag_input.val("");
				// Preventing the tag input to be update with the chosen value.
				return false;
			}
		});

                tag_input.blur(function(){
                      check_for_tag();
		});
		
		function check_for_tag () {
			var typed = tag_input.val();
			typed = typed.replace(/,+$/,"");
			typed = typed.trim();

			if (typed != "") {
				if (is_new(typed)) {
					create_choice(typed);
				}
				// Cleaning the input.
				tag_input.val("");
			}
		}

		function is_new (value) {
			var is_new = true;
			tag_input.parents("ul").children(".tagit-choice").each(function(i){
				n = $(this).children("input").val();
				if (value == n) {
					is_new = false;
				}
			})
			return is_new;
		}


		function create_choice (value) {
            if(options.hiddenFieldName != null)
              field_name = options.hiddenFieldName;
            else
              field_name = 'item[tags][]';

			var el = '';
			el  = '<li class="tagit-choice">';
			el += value;
			el += '<a class="close">x</a>';
			el += '<input type="hidden" style="display:none;" value="'+value+'" name="' + field_name + '">\n'
			el += '</li>';

            var li_search_tags = tag_input.parent();
			$(el).insertBefore(li_search_tags);
			tag_input.val("");
		}

	};

	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,"");
	};

})(jQuery);
