<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/pexels/generator.php';
require_once __DIR__ . '/pexels/api.php';


new BDT_AI_IMG\Pexels\Api();
new BDT_AI_IMG\Pexels\Generator();
