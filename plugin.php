<?php
/**
 * Main Plugin File
 */

namespace BDT_AI_IMG;

if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * The main plugin class
 */
final class Plugin {

	/**
	 * Instance
	 *
	 * @var object
	 * @since 1.0.0
	 */
	private static $instance;

	/**
	 * Instance
	 *
	 * @return object
	 * @since 1.0.0
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();

			do_action( 'ai_image/init' );
		}
		return self::$instance;
	}

	/**
	 * Admin Styles
	 *
	 * @since 1.0.0
	 */
	public function enqueue_admin_styles( $hook_suffix ) {
		// if ( 'toplevel_page_ai-image' !== $hook_suffix && 'ai-image_page_ai-image-get-pro' !== $hook_suffix ) {
		// 	return;
		// }
		$direction_suffix = is_rtl() ? '.rtl' : '';
		wp_register_style( 'ai-image', BDT_AI_IMAGE_URL . 'build/admin/index.css', array(), BDT_AI_IMAGE_VERSION );
		wp_enqueue_style( 'ai-image' );
	}

	/**
	 * Enqueue admin scripts
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function enqueue_admin_scripts( $hook_suffix ) {
		// if ( 'toplevel_page_ai-image' !== $hook_suffix ) {
		// 	return;
		// }
		$asset_file = plugin_dir_path( __FILE__ ) . 'build/admin/index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = include $asset_file;

		wp_register_script( 'ai-image', BDT_AI_IMAGE_URL . 'build/admin/index.js', $asset['dependencies'], $asset['version'], true );

		wp_enqueue_script( 'ai-image' );

		$script_config = array(
			'ajax_url'   => admin_url( 'admin-ajax.php' ),
			'nonce'     => wp_create_nonce( 'rest_nonce' ),
			'assets_url' => BDT_AI_IMAGE_ASSETS,
			'rest_url'   => rest_url( 'bdthemes/v1/' ),
		);

		wp_localize_script(
			'ai-image',
			'AI_IMAGE_AdminConfig',
			$script_config
		);
	}

	/**
	 * Summary of upload_image_to_wp
	 */
	public function upload_image_to_wp() {

		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['nonce'] ), 'bdt-ai-img' ) ) {
			error_log( 'Invalid nonce' ); // Log error for invalid nonce
			wp_send_json_error( array( 'message' => 'Invalid nonce.' ) );
		}

		if ( ! isset( $_POST['image_url'] ) || empty( $_POST['image_url'] ) ) {
			error_log( 'No image URL provided' ); // Log error for missing URL
			wp_send_json_error( array( 'message' => 'No image URL provided.' ) );
		}

		$image_url  = esc_url_raw( wp_unslash( $_POST['image_url'] ) );
		$upload_dir = wp_upload_dir();

		// Try fetching the image
		$response = wp_remote_get( $image_url );

		if ( is_wp_error( $response ) ) {
			error_log( 'Failed to fetch image from URL: ' . $image_url ); // Log failed fetch
			wp_send_json_error( array( 'message' => 'Failed to fetch image.' ) );
		}

		$image_data = wp_remote_retrieve_body( $response );
		$filename   = basename( $image_url );

		// Optional filename transformation
		if ( strpos( $image_url, 'oaidalleapiprodscus.blob.core.windows.net/' ) !== false ) {
			$wp_domain_name = get_site_url();
			$wp_domain_name = str_replace( array( 'http://', 'https://' ), '', strtolower( $wp_domain_name ) );
			$wp_domain_name = preg_replace( '/[^a-z0-9]/', '-', $wp_domain_name );
			$filename       = $wp_domain_name . '-' . time() . '.jpg';
		}

		// Remove query string from filename
		$filename = preg_replace( '/\?.*/', '', $filename );

		// Check if directory exists or create it
		if ( wp_mkdir_p( $upload_dir['path'] ) ) {
			$file = $upload_dir['path'] . '/' . $filename;
		} else {
			$file = $upload_dir['basedir'] . '/' . $filename;
		}

		// Attempt to write file to disk
		$write_result = file_put_contents( $file, $image_data );
		if ( ! $write_result ) {
			error_log( 'Failed to write image file to disk at ' . $file ); // Log file write failure
			wp_send_json_error( array( 'message' => 'Failed to save image to disk.' ) );
		}

		$wp_filetype = wp_check_filetype( $filename, null );
		$attachment  = array(
			'post_mime_type' => $wp_filetype['type'],
			'post_title'     => sanitize_file_name( $filename ),
			'post_content'   => '',
			'post_status'    => 'inherit'
		);

		// Attempt to insert the attachment
		$attach_id = wp_insert_attachment( $attachment, $file );
		if ( ! $attach_id ) {
			error_log( 'Failed to insert attachment' ); // Log attachment failure
			wp_send_json_error( array( 'message' => 'Failed to upload image.' ) );
		}

		// Generate attachment metadata
		require_once( ABSPATH . 'wp-admin/includes/image.php' );
		$attach_data = wp_generate_attachment_metadata( $attach_id, $file );
		wp_update_attachment_metadata( $attach_id, $attach_data );

		// Send successful response
		wp_send_json_success( array( 'attach_id' => $attach_id ) );
	}



	/**
	 * Setup hooks.
	 *
	 * @since 1.0.0
	 */
	private function setup_hooks() {
		add_media_page( 'Image Generator', 'Image Generator', 'read', 'bdt-ai-media-tab', function () {
			?>
			<div class="wrap">
				<h2 class="ai-image-title">Image Generator</h2>
				<div id="ai-image-generator"></div>
			</div>
			<?php
		} );

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ), 999 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ), 999 );
		add_action( 'wp_ajax_upload_image_to_wp', array( $this, 'upload_image_to_wp') );
		add_action( 'wp_ajax_nopriv_upload_image_to_wp', array( $this, 'upload_image_to_wp') );
	}

	/**
	 * Init
	 *
	 * @since 1.0.0
	 */
	public function init() {
		$this->setup_hooks();
	}

}

if ( class_exists( 'BDT_AI_IMG\Plugin' ) ) {
	\BDT_AI_IMG\Plugin::instance();
}
