var MNS_Gallery;

jQuery(function() {
	(function($) {
		
		MNS_Gallery = function(o) {
			var hash = window.location.hash.substring(1);
			
			
			var ctxt = this;
			this.$root = $('#' + o.gallery_id);
			this.$carousel = this.$root.find('.mns-gallery-picker');
			this.$thumbs = this.$root.find('.mns-gallery-entry');
			this.$image_wrapper = this.$root.find('.mns-image-wrapper');
			this.$image = this.$root.find('.mns-gallery-image');
			this.$image_link = this.$root.find('.mns-image-full-link');
			this.$overlay = this.$root.find('.mns-preloader-overlay');
			this.$caption = this.$root.find('.mns-image-caption');
			this.$thumb_anchors = this.$thumbs.find('a.mns-gallery-link');
			this.$thumb_anchors.on('click', function(e) {
				ctxt.activate($(this).data('id'));
				e.preventDefault();
			});
			
			if (hash.length > 0 && /^\d+$/.test(hash)) {
				this.activate(parseInt(hash));
			} else {
				this.activate(o.active);
			}
			
			$('body').on('keypress', function(e) {
				//console.log(e);
				switch (String.fromCharCode(e.keyCode).toUpperCase()) {
					case 'K':
						ctxt.prev();
						break;
					case 'J':
						ctxt.next();
						break;
				}
			});
		};
		
		
		MNS_Gallery.prototype.next = function() {
			if (this.$active.length > 0) {
				var $switch_to = this.$active.next();
				var switch_to_id = $switch_to.data('id');
				this.activate(switch_to_id);
			}
		};
		
		MNS_Gallery.prototype.prev = function() {
			if (this.$active.length > 0) {
				var $switch_to = this.$active.prev();
				var switch_to_id = $switch_to.data('id');
				this.activate(switch_to_id);
			}
		};
		
		
		MNS_Gallery.prototype.activate = function(id) {
			var ctxt = this;
			var $activate = this.$thumbs.filter('li[data-id="' + id + '"]');
			if ($activate.length > 0) {
				this.$thumbs.removeClass('mns-active');
				$activate.addClass('mns-active');
				var $a = $activate.find('a');
				this.$overlay.css({
					left: this.$image.position().left,
					top: this.$image.position().top,
					width: '100%',
					height: '100%'
				}).show();
				
				var $newImage = $('<img/>');
				$newImage.attr('src', $a.data('scaled-url'));
				$newImage.one("load", function() {
					ctxt.$caption.html($activate.data('caption'));
					ctxt.$carousel.scrollLeft($activate.position().left);
					ctxt.$image
						.attr('width', $a.data('width'))
						.attr('height', $a.data('height'))
						.attr('src', $a.data('scaled-url'));
					ctxt.$image_link.attr('href', $a.data('full-url'));
					window.location.hash = "#" + id;
					ctxt.$active = $activate;
					ctxt.$overlay.hide();
				}).each(function() {
					if(this.complete) $(this).load();
				});
				
				
			}
		}
		
			
	})(jQuery);
});