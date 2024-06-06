<?php

// add submenu page to media
function my_custom_media_tab() {
	add_media_page( 'Image Generator', 'Image Generator', 'read', 'bdt-ai-media-tab', 'my_custom_media_tab_content' );
}

add_action( 'admin_menu', 'my_custom_media_tab' );

function my_custom_media_tab_content() {
	?>
	<div class="wrap">
		<h2 class="ai-image-title">Image Generator</h2>

		<div class="ai-image-tabs">
			<div class="ai-image-tabs-search-wrap">
				<ul class="ai-image-tabs__nav">
					<li class="ai-image-tabs__nav-item active openai" data-tab-target="openai">Open AI</li>
					<li class="ai-image-tabs__nav-item pexels" data-tab-target="pexels">Pexels</li>
					<li class="ai-image-tabs__nav-item pixabay" data-tab-target="pixabay">Pixabay</li>
					<!-- <li class="ai-image-tabs__nav-item unsplash" data-tab-target="tab3">Unsplash</li> -->
				</ul>

				<form id="aiImage-search-form" class="ai-image-search">
					<input type="text" id="aiImage-search-input" placeholder="Search for images">
					<button type="submit" >
						<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
						</svg>
					</button>
				</form>
			</div>

			<div class="ai-image-tabs__content">
				<div class="ai-image-tabs__content-item active" id="openai">
					<div id="openai-loaded-images" class="aiImg-loaded-images"></div>
					<div id="openai-loading-indicator" style="display: none;"><img style="background-color: #fff;" src="<?php echo esc_url( BDT_AI_IMAGE_ASSETS ); ?>imgs/icons8-loading (2).gif"></div>
				</div>
				<div class="ai-image-tabs__content-item" id="pexels">
					<div id="pexels-loaded-images" class="aiImg-loaded-images"></div>
					<div id="pexels-loading-indicator" style="display: none;"><img style="background-color: #fff;" src="<?php echo esc_url( BDT_AI_IMAGE_ASSETS ); ?>imgs/icons8-loading (2).gif"></div>
				</div>
				<div class="ai-image-tabs__content-item" id="pixabay">
					<div id="pixabay-loaded-images" class="aiImg-loaded-images"></div>
					<div id="pixabay-loading-indicator" style="display: none;"><img style="background-color: #fff;" src="<?php echo esc_url( BDT_AI_IMAGE_ASSETS ); ?>imgs/icons8-loading (2).gif"></div>
				</div>
				<div class="ai-image-tabs__content-item" id="tab3">
					<div id="unsplash-loaded-images" class="aiImg-loaded-images"></div>
					<div id="unsplash-loading-indicator" style="display: none;"><img style="background-color: #fff;" src="<?php echo esc_url( BDT_AI_IMAGE_ASSETS ); ?>imgs/icons8-loading (2).gif"></div>
				</div>
			</div>
		</div>
	</div>
	<?php
}

function upload_image_to_wp() {
	if ( ! isset( $_POST['image_url'] ) || empty( $_POST['image_url'] ) ) {
		wp_send_json_error( 'No image URL provided.' );
	}

	$image_url  = esc_url_raw( $_POST['image_url'] );
	$upload_dir = wp_upload_dir();

	$image_data = file_get_contents( $image_url );
	$filename   = basename( $image_url );
	// remove query string from filename
	$filename = preg_replace( '/\?.*/', '', $filename );

	if ( wp_mkdir_p( $upload_dir['path'] ) ) {
		$file = $upload_dir['path'] . '/' . $filename;
	} else {
		$file = $upload_dir['basedir'] . '/' . $filename;
	}

	file_put_contents( $file, $image_data );

	$wp_filetype = wp_check_filetype( $filename, null );
	$attachment  = array(
		'post_mime_type' => $wp_filetype['type'],
		'post_title'     => sanitize_file_name( $filename ),
		'post_content'   => '',
		'post_status'    => 'inherit'
	);

	$attach_id = wp_insert_attachment( $attachment, $file );
	require_once ( ABSPATH . 'wp-admin/includes/image.php' );
	$attach_data = wp_generate_attachment_metadata( $attach_id, $file );
	wp_update_attachment_metadata( $attach_id, $attach_data );

	if ( $attach_id ) {
		wp_send_json_success( array( 'attach_id' => $attach_id ) );
	} else {
		wp_send_json_error( 'Failed to upload image.' );
	}
}

add_action( 'wp_ajax_upload_image_to_wp', 'upload_image_to_wp' );
add_action( 'wp_ajax_nopriv_upload_image_to_wp', 'upload_image_to_wp' );
