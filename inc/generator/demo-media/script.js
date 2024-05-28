(function ($) {
    $(document).ready(function () {
        console.log('script.js loaded 1');

        var api = 'l7Pk56fQ7sjfslcgFBUXVuggY5sZ2EIRLtSvM1pBwLyzpIWjdQ93gVpH';
        var page = 1;
        var per_page = 15;
        var loading = false;
        var search = '';
        var searchMode = false;

        function loadImages(reset = false) {
            if (loading) return;
            loading = true;

            // Show the loading indicator
            $('#loading-indicator').show();

            var url = searchMode ? 'http://192.168.1.111:9001/wp-json/bdthemes/pexels/v1/search' : 'http://192.168.1.111:9001/wp-json/bdthemes/pexels/v1/curated';
            var data = {
                api_key: api,
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
                    var images = response;
                    var output = '';

                    $.each(images, function (index, image) {
                        output += `<div class="paw-image">`;
                        output += `<img src="${image.src.medium}" alt="${image.photographer}">`;
                        output += `<div class="paw-image-info">`;
                        output += `<p>Photographer: <a href="${image.photographer_url}">${image.photographer}</a></p>`;
                        // Photographer image will be displayed in the modal
                        output += `<img src="${image.photographer_url}" alt="${image.photographer}">`;


                        // output += `<a href="${image.src.original}" target="_blank">Download</a>`;
                        output += `<a href="${image.url}" target="_blank">View on Pexels</a>`;
                        output += '<button class="download-btn" data-url="' + image.src.original + '">Upload</button>';
                        output += `<button class="download-btn" data-url="${image.src.large}">Large</button>`;
                        output += `<button class="download-btn" data-url="${image.src.medium}">Medium</button>`;
                        output += `<button class="download-btn" data-url="${image.src.small}">Small</button>`;
                        output += `</div>`;
                        output += `</div>`;

                    });

                    if (reset) {
                        $('#paw-images').html(output);
                    } else {
                        $('#paw-images').append(output);
                    }

                    // Hide the loading indicator
                    $('#loading-indicator').hide();

                    loading = false;
                    page++;
                },
                error: function () {
                    // Hide the loading indicator
                    $('#loading-indicator').hide();

                    loading = false;
                }
            });
        }

        function checkScroll() {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                loadImages();
            }
        }

        $(window).on('scroll', checkScroll);

        // Initial load
        loadImages();

        // Search form submission
        $('#search-form').on('submit', function (e) {
            e.preventDefault();
            search = $('#search-input').val().trim();
            page = 1;
            searchMode = true;
            loadImages(true);
        });

        // Handle download button click
        $(document).on('click', '.download-btn', function () {
            var imageUrl = $(this).data('url');
            var button = $(this);

            // Show loading indicator on the button
            button.text('Uploading...');

            $.ajax({
                url: 'http://192.168.1.111:9001/wp-admin/admin-ajax.php', // Replace with your WordPress AJAX URL
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
        });

    });
})(jQuery);
