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
	}

}
