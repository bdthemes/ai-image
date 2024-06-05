<?php

/**
 * Generator
 */
namespace BDT_AI_IMG\Pixabay;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Generator Class
 */
class Generator {

    /**
     * Pixeles API Call
     */
    public static function pixabay_api_call( $q, $api_key, $page = 1, $per_page = 15 ) {
		$q = urlencode( $q );
		$url = 'https://pixabay.com/api/?key=' . $api_key . '&q=' . $q . '&image_type=photo&page=' . $page . '&per_page=' . $per_page . '&pretty=true';

        $response = wp_remote_get( $url );

		// error_log( print_r( $url, true ) );
		// error_log( print_r( $response, true ) );

        if ( is_wp_error( $response ) ) {
            return $response->get_error_message();
        }

        $body = wp_remote_retrieve_body( $response );

        $data = json_decode( $body );

		// error_log( print_r( $data, true ) );

        return $data;
    }

    /**
     * Get Images
     */
    public static function get_images( $search, $api_key, $page = 1, $per_page = 15 ) {
        $data = self::pixabay_api_call( $search, $api_key, $page, $per_page );

        if ( is_wp_error( $data ) ) {
            return $data->get_error_message();
        }

        return $data->hits ?? array();

    }

    /**
     * Generate Image
     */
    public static function generate_image ( $search, $api_key, $page = 1, $per_page = 15 ) {
        $images = self::get_images( $search, $api_key, $page, $per_page );

        if ( is_wp_error( $images ) ) {
            return $images->get_error_message();
        }

        $output = '<div class="pexels-images">';
        foreach ( $images as $image ) {
            $output .= '<div class="pexels-image">';
            $output .= '<img src="' . $image->src->medium . '" alt="' . $image->photographer . '">';
            $output .= '<p>Photographer: ' . $image->photographer . '</p>';
            $output .= '</div>';
        }
        $output .= '</div>';

        return $output;
    }
}
