<?php

/**
 * Plugin Name: AI Image
 * Plugin URI: https://bdthemes.com
 * Description: AI Image blocks for WordPress Users to generate images using OpenAI API.
 * Version: 1.0.0
 * Author: BDThemes
 * Author URI: https://bdthemes.com
 * License: GPLv3
 * Text Domain: ai-image
 * Domain Path: /languages/
 */

// Stop Direct Access
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Blocks Final Class
 */

final class BDT_AIImage {
	public function __construct() {

		// block initialization
		add_action('init', [$this, 'blocks_init']);

		// blocks category
		if (version_compare($GLOBALS['wp_version'], '5.7', '<')) {
			add_filter('block_categories', [$this, 'register_block_category'], 10, 999999);
		} else {
			add_filter('block_categories_all', [$this, 'register_block_category'], 10, 999999);
		}
		// load plugin files
		$this->load_files();
	}

	/**
	 * Initialize the plugin
	 */

	public static function init() {
		static $instance = false;
		if (!$instance) {
			$instance = new self();
		}
		return $instance;
	}

	/**
	 * Load Plugin Files
	 */
	public function load_files() {
		require_once __DIR__ . '/Api/api.php';
		new BdThemes_OpenAI_Rest_Controller();
		is_admin() ? require_once __DIR__ . '/admin/settings.php' : '';
	}

	/**
	 * Blocks Registration
	 */

	public function register_block($name, $options = array()) {
		register_block_type(__DIR__ . '/build/blocks/' . $name, $options);
	}

	/**
	 * Blocks Initialization
	 */
	public function blocks_init() {
		// register single block
		$this->register_block('image-generator');
	}

	/**
	 * Register Block Category
	 */

	public function register_block_category($categories, $post) {
		return array_merge(
			array(
				array(
					'slug'  => 'ai-image',
					'title' => __('Ai image', 'ai-image'),
				),
			),
			$categories,
		);
	}
}

/**
 * Kickoff
 */

BDT_AIImage::init();
