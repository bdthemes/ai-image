<?php

// add submenu page to media
function my_custom_media_tab() {
	add_media_page( 'Image Generator', 'Image Generator', 'read', 'bdt-ai-media-tab', 'my_custom_media_tab_content' );
}

add_action( 'admin_menu', 'my_custom_media_tab' );

function my_custom_media_tab_content() {
	?>
	<div class="wrap">
		<h2>Image Generator</h2>
		<div id="bdt-ai-media-tab"></div>
	</div>

	<form id="search-form">
		<input type="text" id="search-input" placeholder="Search for images">
		<input type="submit" value="Search">
	</form>
	<style>
		form {
			margin-top: 20px;
			margin-bottom: 20px;
		}

		input[type="text"],
		input[type="submit"] {
			padding: 10px;
			font-size: 16px;
			border: 1px solid #ccc;
			border-radius: 5px;
		}

		input[type="submit"] {
			background-color: #333;
			color: #fff;
			cursor: pointer;
		}

		input[type="submit"]:hover {
			background-color: #444;
		}

		#paw-images {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 20px;
		}

		#paw-images img {
			width: 100%;
			height: auto;
		}
	</style>
	<div id="paw-images"></div>
	<div id="loading-indicator" style="display: none;">Loading...</div>

	<?php
}

function upload_image_to_wp() {
    if (!isset($_POST['image_url']) || empty($_POST['image_url'])) {
        wp_send_json_error('No image URL provided.');
    }

    $image_url = esc_url_raw($_POST['image_url']);
    $upload_dir = wp_upload_dir();

    $image_data = file_get_contents($image_url);
    $filename = basename($image_url);

    if (wp_mkdir_p($upload_dir['path'])) {
        $file = $upload_dir['path'] . '/' . $filename;
    } else {
        $file = $upload_dir['basedir'] . '/' . $filename;
    }

    file_put_contents($file, $image_data);

    $wp_filetype = wp_check_filetype($filename, null);
    $attachment = array(
        'post_mime_type' => $wp_filetype['type'],
        'post_title' => sanitize_file_name($filename),
        'post_content' => '',
        'post_status' => 'inherit'
    );

    $attach_id = wp_insert_attachment($attachment, $file);
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $attach_data = wp_generate_attachment_metadata($attach_id, $file);
    wp_update_attachment_metadata($attach_id, $attach_data);

    if ($attach_id) {
        wp_send_json_success(array('attach_id' => $attach_id));
    } else {
        wp_send_json_error('Failed to upload image.');
    }
}

add_action('wp_ajax_upload_image_to_wp', 'upload_image_to_wp');
add_action('wp_ajax_nopriv_upload_image_to_wp', 'upload_image_to_wp');
