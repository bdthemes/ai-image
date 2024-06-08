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
					<li class="ai-image-tabs__nav-item active openai" data-tab-target="openai">
						<span>Open AI</span>
						<svg xmlns="http://www.w3.org/2000/svg" id="a" viewBox="0 0 100.1 100.1">
							<path d="m6.3,0h87.5c3.5,0,6.3,2.8,6.3,6.3v87.5c0,3.5-2.8,6.3-6.3,6.3H6.3c-3.5-.1-6.3-2.9-6.3-6.4V6.3C0,2.8,2.8,0,6.3,0Z" style="stroke-width:0px;"/><path d="m72.11,45.38c1.17-3.47.77-7.28-1.11-10.42-1.38-2.37-3.48-4.23-5.99-5.33-2.52-1.11-5.33-1.4-8.02-.83-1.22-1.36-2.71-2.44-4.38-3.17-1.67-.74-3.49-1.11-5.31-1.1-2.75,0-5.43.85-7.67,2.45-2.22,1.59-3.88,3.84-4.74,6.44-1.79.36-3.49,1.1-4.97,2.16-1.48,1.06-2.72,2.42-3.63,3.99-2.84,4.82-2.19,10.93,1.6,15.05-1.17,3.47-.77,7.28,1.1,10.42,1.38,2.37,3.48,4.23,5.99,5.33,2.52,1.11,5.33,1.4,8.02.83,1.22,1.36,2.71,2.44,4.38,3.17,1.67.73,3.49,1.11,5.32,1.1,2.75,0,5.44-.85,7.68-2.45,2.23-1.59,3.89-3.85,4.74-6.45,1.79-.36,3.49-1.1,4.97-2.16,1.48-1.06,2.72-2.42,3.63-3.99,2.84-4.82,2.18-10.93-1.61-15.04h0Zm-19.3,26.76c-2.57,0-4.56-.78-6.29-2.21.08-.04.22-.12.31-.17l10.28-5.86c.52-.29.84-.84.84-1.44v-14.3l4.35,2.47s.08.07.08.12v11.84c0,5.37-4.53,9.55-9.56,9.55h0Zm-20.89-8.76c-1.13-1.93-1.54-4.19-1.16-6.4.08.05.21.13.31.18l10.28,5.86c.52.3,1.17.3,1.69,0l12.55-7.15v4.95c0,.05-.02.1-.06.13l-10.39,5.92c-2.23,1.26-4.86,1.6-7.34.95-2.47-.65-4.58-2.25-5.88-4.44h0Zm-2.71-22.14c1.14-1.94,2.92-3.42,5.04-4.19v12.06c0,.6.32,1.15.84,1.44l12.55,7.15-4.34,2.47s-.1.03-.15.01l-10.39-5.93c-2.21-1.26-3.83-3.34-4.5-5.79-.66-2.44-.32-5.05.96-7.24h0Zm35.7,8.2l-12.55-7.15,4.34-2.47s.1-.03.15-.01l10.39,5.92c1.59.9,2.88,2.24,3.74,3.85,1.73,3.28,1.39,7.27-.89,10.2-1.12,1.45-2.63,2.55-4.35,3.17v-12.07c0-.6-.31-1.15-.84-1.44Zm4.32-6.43c-.1-.06-.2-.12-.31-.18l-10.28-5.86c-.52-.3-1.17-.3-1.69,0l-12.55,7.15v-4.95c0-.05.02-.1.06-.13l10.39-5.91c3.25-1.85,7.28-1.68,10.37.44,1.5,1.03,2.68,2.47,3.39,4.15.71,1.67.92,3.51.61,5.3Zm-27.18,8.83l-4.35-2.47s-.08-.07-.08-.12v-11.84c0-1.81.53-3.59,1.51-5.12.99-1.53,2.4-2.76,4.06-3.52,3.4-1.57,7.4-1.06,10.29,1.31-.1.05-.2.11-.31.17l-10.28,5.86c-.52.29-.84.84-.85,1.44,0,0,0,14.29,0,14.29Zm2.36-5.02l5.59-3.18,5.59,3.18v6.37l-5.59,3.18-5.59-3.18v-6.37Z" style="fill:#fff; stroke-width:0px;"/>
						</svg>
					</li>
					<li class="ai-image-tabs__nav-item pexels" data-tab-target="pexels">
						<span>Pexels</span>
						<svg xmlns="http://www.w3.org/2000/svg" id="a" viewBox="0 0 100.1 100.1">
							<path d="m6.3,0h87.5c3.5,0,6.3,2.8,6.3,6.3v87.5c0,3.5-2.8,6.3-6.3,6.3H6.3c-3.5-.1-6.3-2.9-6.3-6.4V6.3C0,2.8,2.8,0,6.3,0Z" style="fill:#05a081; stroke-width:0px;"/><path d="m39.32,67.16h13.31v-12.87h3.96c5.94-.11,10.67-4.95,10.56-10.89-.11-5.83-4.73-10.56-10.56-10.56h-17.27v34.32Zm20.13,6.93h-26.95V25.91h24.2c9.68,0,17.6,7.92,17.6,17.6,0,8.58-6.27,15.95-14.74,17.38v13.2h-.11Z" style="fill:#fff; stroke-width:0px;"/>
						</svg>
					</li>
					<li class="ai-image-tabs__nav-item pixabay" data-tab-target="pixabay">
						<span>Pixabay</span>
						<svg xmlns="http://www.w3.org/2000/svg" id="a" viewBox="0 0 100.1 100.1">
							<path d="m6.3,0h87.5c3.5,0,6.3,2.8,6.3,6.3v87.5c0,3.5-2.8,6.3-6.3,6.3H6.3c-3.5-.1-6.3-2.9-6.3-6.4V6.3C0,2.8,2.8,0,6.3,0Z" style="fill:#48a947; stroke-width:0px;"/><path d="m51.38,42.69c-1.11-11.63-12.65-19.92-24.03-16.16-7.7,2.57-12.83,9.75-12.83,18.38v32.06c0,.6.09,1.2.17,1.97,2.39.17,4.87.17,7.27.09v-15.22h10.35c2.56,0,5.13-.34,7.61-1.37,7.69-3.25,12.23-11.03,11.46-19.75Zm-7.35,3.51c-.77,5.47-5.22,10.09-11.37,10-3.51-.09-6.93,0-10.69,0,0-4.62-.26-8.89.17-13.17.43-5.98,6.33-10.52,12.14-9.75,6.24.85,10.6,6.67,9.75,12.91Z" style="fill:#fafcfa; stroke-width:0px;"/><path d="m71.72,44.14l12.31-18.47h-8.89l-8.81,13.08-8.81-13.08h-8.98l12.31,18.47-13.77,19.41h8.89c3.51-4.53,6.58-9.41,10.35-14.02l10.26,14.02h8.98l-13.85-19.41Z" style="fill:#fafcfa; stroke-width:0px;"/>
						</svg>
					</li>
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
