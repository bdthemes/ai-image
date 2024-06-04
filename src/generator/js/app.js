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
				var getImgData = [];
				if ('pixels' === type) {
					var getImgData = App.preparePixelsImages(imgData);
				}

				if ('pixabay' === type) {
					var getImgData = App.preparePixabayImages(imgData);
				}

				$.each(getImgData, function (index, image) {
					let sources = image.src;

					let downloadBtns = '';

					for (let key in sources) {
						downloadBtns += `<button download class="btn btn-primary bdt-aimg-download-btn" data-url="${sources[key]}">Download ${key}</button>`;
					}

					// output += `
					// 	<div class="card">
					// 		<img src="${image.thumbnail}" class="card-img-top" alt="${image.photographer}">
					// 		<div class="card-body">
					// 			<h5 class="card-title
					// 			">${image.photographer}</h5>
					// 		</div>
					// 		<div class="card-button-wrap">
					// 			<a href="${image.url}" target="_blank" class="btn btn-primary">View</a>
					// 			` + downloadBtns + `
					// 		</div>
					// 	</div>
					// `;
					console.log(image);
					output += `
					<div class="card">
					     <div class="aiImg-image-wrap">
						     <img src="${image.src.original}" class="card-img-top" alt="${image.photographer}">

						  	 <div class="aiImg-download-view-wrap">
									<a href="https://www.pexels.com/photo/steam-and-barren-hills-landscape-24778776/" target="_blank" title="View More" class="dropbtn aiImg-view-btn">
										<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
											<path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
											<path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
										</svg>
									</a>
							  </div>
						 </div>

						<div class="aiImg-content-wrap">
							<a href="#" class="aiImg-author-wrap">
								<img src="https://images.pexels.com/users/avatars/748453803/alexander-mass-974.jpeg?auto=compress&fit=crop&h=130&w=130&dpr=1" class="aiImg-author-img" alt="Tomáš Malík">
								<span class="aiImg-author-name">Tomáš Malík</span>
							</a>

							<div class="download-button-dropdown">
								<button class="dropbtn aiImg-drop-btn aiImg-download-large" data-url="https://images.pexels.com/photos/24778776/pexels-photo-24778776.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940">
									download
									<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
									</svg>
								</svg>
								</button>

								<div class="download-button-content">

									<button download="" class="btn btn-primary bdt-aimg-download-btn" data-url="https://images.pexels.com/photos/24778776/pexels-photo-24778776.jpeg"> 
										<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"/>
										</svg>
										<span>original</span>
									</button>

									<button download="" class="btn btn-primary bdt-aimg-download-btn" data-url="https://images.pexels.com/photos/24778776/pexels-photo-24778776.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940">
									<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"/>
										</svg>
										<span>large</span>
									</button>

									<button download="" class="btn btn-primary bdt-aimg-download-btn" data-url="https://images.pexels.com/photos/24778776/pexels-photo-24778776.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=350">
										<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"/>
										</svg>
										<span>medium</span>
									</button>

									<button download="" class="btn btn-primary bdt-aimg-download-btn" data-url="https://images.pexels.com/photos/24778776/pexels-photo-24778776.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=130">
										<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"/>
										</svg>
										<span>small</span>
									
									</button>

								</div>
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
				document.getElementById('pixels-loading-indicator').style.display = 'block';

				var url = searchMode ? restURL + 'pexels/search' : restURL + 'pexels/curated';
				var data = {
					api_key: api_pixels,
					page: page,
					per_page: per_page
				};

				if (searchMode) {
					data.search = search;
				}

				fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				})
					.then(response => response.json())
					.then(response => {
						var output = App.showImages(response, 'pixels');

						if (reset) {
							document.getElementById('pixels-loaded-images').innerHTML = output;
						} else {
							document.getElementById('pixels-loaded-images').insertAdjacentHTML('beforeend', output);
						}

						// Hide the loading indicator
						document.getElementById('pixels-loading-indicator').style.display = 'none';

						loading = false;
						page++;
					})
					.catch(() => {
						// Hide the loading indicator
						document.getElementById('pixels-loading-indicator').style.display = 'none';

						loading = false;
					});
			},
			loadPixabayImages: function (reset = false) {
				if (loading) return;
				loading = true;

				// Show the loading indicator
				document.getElementById('pixabay-loading-indicator').style.display = 'block';

				var url = searchMode ? restURL + 'pixabay/search' : restURL + 'pixabay/curated';
				var data = {
					api_key: api_pixabay,
					page: page,
					per_page: per_page
				};

				if (searchMode) {
					data.search = search;
				}

				fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				})
					.then(response => response.json())
					.then(response => {
						var output = App.showImages(response, 'pixabay');

						if (reset) {
							document.getElementById('pixabay-loaded-images').innerHTML = output;
						} else {
							document.getElementById('pixabay-loaded-images').insertAdjacentHTML('beforeend', output);
						}

						// Hide the loading indicator
						document.getElementById('pixabay-loading-indicator').style.display = 'none';

						loading = false;
						page++;
					})
					.catch(() => {
						// Hide the loading indicator
						document.getElementById('pixabay-loading-indicator').style.display = 'none';

						loading = false;
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
			downLoad: function (img) {
				var imageUrl = $(img).data('url');
				var button = $(img);

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

				$(document).on('click', '.bdt-aimg-download-btn', function () {
					App.downLoad(this);
				});
			},
			
		}

		App.init();
	});

})(jQuery);
