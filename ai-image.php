<?php

/**
 * Plugin Name: AI Image
 * Plugin URI: https://bdthemes.com
 * Description: AI Image blocks for WordPress Users to generate images using OpenAI API.
 * Version: 1.5.2
 * Author: BdThemes
 * Author URI: https://bdthemes.com
 * License: GPLv3
 * Text Domain: ai-image
 * Domain Path: /languages/
 */

define( 'BDT_AI_IMAGE_VERSION', '1.5.2' );

define( 'BDT_AI_IMAGE__FILE__', __FILE__ );
define( 'BDT_AI_IMAGE_PATH', plugin_dir_path( BDT_AI_IMAGE__FILE__ ) );
define( 'BDT_AI_IMAGE_INCLUDES', BDT_AI_IMAGE_PATH . 'inc/' );
define( 'BDT_AI_IMAGE_URL', plugins_url( '/', BDT_AI_IMAGE__FILE__ ) );
define( 'BDT_AI_IMAGE_ASSETS', BDT_AI_IMAGE_URL . '/assets/' );
define( 'BDT_AI_IMAGE_PATH_NAME', basename( dirname( BDT_AI_IMAGE__FILE__ ) ) );
define( 'BDT_AI_IMAGE_INC_PATH', BDT_AI_IMAGE_PATH . 'includes/' );

add_action( 'init', function () {
	require_once BDT_AI_IMAGE_INCLUDES . 'api/init.php';
} );


/**
 * Blocks Final Class
 */

final class BDTHEMES_AI_IMAGE {
	public function __construct() {

		// block initialization
		// add_action( 'init', [ $this, 'blocks_init' ] );

		// blocks category
		if ( version_compare( $GLOBALS['wp_version'], '5.7', '<' ) ) {
			add_filter( 'block_categories', [ $this, 'register_block_category' ], 10, 999999 );
		} else {
			add_filter( 'block_categories_all', [ $this, 'register_block_category' ], 10, 999999 );
		}
		// load plugin files
		add_action( 'plugins_loaded', [ $this, 'load_files' ] );
	}

	/**
	 * Initialize the plugin
	 */

	public static function init() {
		static $instance = false;
		if ( ! $instance ) {
			$instance = new self();
		}
		return $instance;
	}

	/**
	 * Load Plugin Files
	 */
	public function load_files() {
		require_once __DIR__ . '/admin/api.php';
		require_once BDT_AI_IMAGE_PATH . 'plugin.php';

		if ( is_admin() ) {
			require_once __DIR__ . '/admin/settings.php';
		}
	}

	/**
	 * Blocks Registration
	 */

	public function register_block( $name, $options = array() ) {
		register_block_type( __DIR__ . '/build/blocks/' . $name, $options );
	}

	/**
	 * Blocks Initialization
	 */
	public function blocks_init() {
		// register single block
		$this->register_block( 'image-generator' );
	}

	/**
	 * Register Block Category
	 */

	public function register_block_category( $categories, $post ) {
		return array_merge(
			array(
				array(
					'slug'  => 'ai-image',
					'title' => __( 'Ai image', 'ai-image' ),
				),
			),
			$categories,
		);
	}
}

/**
 * Kickoff
 */

BDTHEMES_AI_IMAGE::init();
