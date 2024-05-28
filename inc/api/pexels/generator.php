<?php

/**
 * Generator
 */
namespace BDT_AI_IMG\Pexels;

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
    public static function pexels_api_call( $search, $api_key, $page = 1, $per_page = 15 ) {
        $url = 'https://api.pexels.com/v1/search?query=' . $search;
        $url .= '&page=' . $page;
        $url .= '&per_page=' . $per_page;

        if('curated' === $search) {
            $url = 'https://api.pexels.com/v1/curated';
			$url .= '?page=' . $page;
			$url .= '&per_page=' . $per_page;
        }

        $response = wp_remote_get( $url, array(
            'headers' => array(
                'Authorization' => $api_key
            )
        ) );

        if ( is_wp_error( $response ) ) {
            return $response->get_error_message();
        }

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body );

        return $data;
    }

    /**
     * Get Images
     */
    public static function get_images( $search, $api_key, $page = 1, $per_page = 15 ) {
        $data = self::pexels_api_call( $search, $api_key, $page, $per_page );

        if ( is_wp_error( $data ) ) {
            return $data->get_error_message();
        }

        return $data->photos ?? array();

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
