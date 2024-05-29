<?php

namespace BDT_AI_IMG;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Generator Class
 */
class Generator {

	public function __construct() {
		/**
		 * Routes Init must be public
		 */
		require_once __DIR__ . '/api/init.php';

		if ( is_admin() ) {
			require_once __DIR__ . '/generator/demo-media/demo-media.php';
		}

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	public function enqueue_scripts() {

		wp_enqueue_script( 'bdt-ai-img', BDT_AI_IMAGE_URL . '/inc/generator/demo-media/script.js', array( 'jquery', 'media-upload' ), '1.0.0', true );

		wp_localize_script( 'bdt-ai-img', 'BDT_AI_IMG', array(
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'nonce'    => wp_create_nonce( 'bdt-ai-img' ),
			'rest_url' => rest_url( 'bdthemes/v1/' ),
		) );

	}



}
