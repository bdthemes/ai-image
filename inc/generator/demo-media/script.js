(function ($) {
	$(document).ready(function () {
		console.log('script.js loaded 1');
		const restURL = BDT_AI_IMG.rest_url;
		const api_pixels = 'l7Pk56fQ7sjfslcgFBUXVuggY5sZ2EIRLtSvM1pBwLyzpIWjdQ93gVpH';
		const api_pixabay = '27427772-5e3b7770787f4e0e591d5d2eb';
		var page = 1;
		var per_page = 15;
		var loading = false;
		var search = '';
		var searchMode = false;


		const App = {
			tabs: function () {
				$(document).ready(function () {
					$('.ai-image-tabs__nav-item').click(function () {
						var targetTab = $(this).data('tabTarget');

						$('.ai-image-tabs__nav-item').removeClass('active');
						$(this).addClass('active');

						$('.ai-image-tabs__content-item').removeClass('active');
						$('#' + targetTab).addClass('active');
					});
				});
			},
			preparePixelsImages: function (images) {
				var output = [];

				$.each(images, function (index, image) {
					output.push({
						src: {
							original: image.src.original,
							large: image.src.large,
							medium: image.src.medium,
							small: image.src.small
						},
						photographer: image.photographer,
						photographer_url: image.photographer_url,
						url: image.url,
						thumbnail: image.src.tiny
					});
				});

				return output;
			},
			preparePixabayImages: function (images) {
			},
			showImages: function (imgData, type) {
				var output = '';

				if ('pixels' === type) {
					const getImgData = App.preparePixelsImages(imgData);
				}

				if ('pixabay' === type) {
					const getImgData = App.preparePixabayImages(imgData);
				}

				$.each(getImgData, function (index, image) {
					let sources = image.src;

					let downloadBtns = '';

					for (let key in sources) {
						downloadBtns += `<button download class="btn btn-primary download-btn" data-url="${sources[key]}">Download ${key}</button>`;
					}

					output += `
					<div class="col-6 col-md-4 col-lg-3 mb-4">
						<div class="card">
							<img src="${image.thumbnail}" class="card-img-top" alt="${image.photographer}">
							<div class="card-body">
								<h5 class="card-title
								">${image.photographer}</h5>
								<a href="${image.url}" target="_blank" class="btn btn-primary">View</a>
								` + downloadBtns + `
							</div>
						</div>
					</div>
					`;
				});

				return output;
			},
			loadPixelsImages: function (reset = false) {
				if (loading) return;
				loading = true;

				// Show the loading indicator
				$('#pixels-loading-indicator').show();

				var url = searchMode ? restURL + 'pexels/search' : restURL + 'pexels/curated';
				var data = {
					api_key: api_pixels,
					page: page,
					per_page: per_page
				};

				if (searchMode) {
					data.search = search;
				}

				$.ajax({
					url: url,
					method: 'POST',
					data: data,
					success: function (response) {

						var output = App.showImages(response, 'pixels');

						if (reset) {
							$('#pixels-loaded-images').html(output);
						} else {
							$('#pixels-loaded-images').append(output);
						}

						// Hide the loading indicator
						$('#pixels-loading-indicator').hide();

						loading = false;
						page++;
					},
					error: function () {
						// Hide the loading indicator
						$('#pixels-loading-indicator').hide();

						loading = false;
					}
				});
			},
			loadPixabayImages: function (reset = false) {
				if (loading) return;
				loading = true;

				// Show the loading indicator
				$('#pixabay-loading-indicator').show();

				var url = searchMode ? restURL + 'pixabay/search' : restURL + 'pixabay/curated';
				var data = {
					api_key: api_pixabay,
					page: page,
					per_page: per_page
				};

				if (searchMode) {
					data.search = search;
				}

				$.ajax({
					url: url,
					method: 'POST',
					data: data,
					success: function (response) {

						var output = App.showImages(response, 'pixabay');

						if (reset) {
							$('#pixabay-loaded-images').html(output);
						} else {
							$('#pixabay-loaded-images').append(output);
						}

						// Hide the loading indicator
						$('#pixabay-loading-indicator').hide();

						loading = false;
						page++;
					},
					error: function () {
						// Hide the loading indicator
						$('#pixabay-loading-indicator').hide();

						loading = false;
					}
				});
			},
			checkScroll: function () {
				if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
					App.loadPixelsImages();
				}
			},
			searchForm: function () {
				$('#pixels-search-form').on('submit', function (e) {
					e.preventDefault();
					search = $('#pixels-search-input').val().trim();
					page = 1;
					searchMode = true;
					App.loadPixelsImages(true);
				});
				$('#pixabay-search-form').on('submit', function (e) {
					e.preventDefault();
					search = $('#pixabay-search-input').val().trim();
					page = 1;
					searchMode = true;
					App.loadPixabayImages(true);
				});
			},
			downLoad: function () {
				var imageUrl = $(this).data('url');
				var button = $(this);

				// Show loading indicator on the button
				button.text('Uploading...');
				$.ajax({
					url: BDT_AI_IMG.ajax_url, // Replace with your WordPress AJAX URL
					method: 'POST',
					data: {
						action: 'upload_image_to_wp',
						image_url: imageUrl
					},
					success: function (response) {
						if (response.success) {
							button.text('Uploaded');
						} else {
							button.text('Failed');
						}
					},
					error: function () {
						button.text('Failed');
					}
				});
			},
			init: function () {
				/**
				 * Layout
				 */
				App.tabs();
				/**
				 * /Layout
				 */

				App.loadPixelsImages();
				$(window).on('scroll', App.checkScroll);
				App.searchForm();

				$(document).on('click', '.download-btn', function () {
					App.downLoad.call(this);
				});
			}
		}

		App.init();

	});
})(jQuery);
