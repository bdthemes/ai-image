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
			'ajaxurl'   => admin_url( 'admin-ajax.php' ),
			'nonce'     => wp_create_nonce( 'rest_nonce' ),
			'assetsUrl' => BDT_AI_IMAGE_ASSETS,
			'restUrl'   => rest_url( 'bdthemes/v1/' ),
		);

		wp_localize_script(
			'ai-image',
			'AI_IMAGE_LocalizeAdminConfig',
			$script_config
		);
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
