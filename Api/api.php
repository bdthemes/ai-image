<?php
/*
* OpenAI Rest Controller 
*/
class BdThemes_OpenAI_Rest_Controller extends WP_REST_CONTROLLER {
    public function __construct() {
        $this->namespace = 'bdthemes/v1';
        $this->rest_base = 'openai';
        add_action('rest_api_init', [$this, 'register_rest_routes']);
    }
    public function register_rest_routes() {
        register_rest_route($this->namespace, $this->rest_base . '/images/generations', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [$this, 'image_generation_request'],
            'permission_callback' => [$this, 'image_generation_permission_check'],
        ]);
    }
    public function image_generation_request(WP_REST_Request $request) {
        $paramaters = $request->get_params();
        $api_key = $this->get_openai_api_key();
        if (!$api_key) {
            return new WP_Error('no_api_key', 'No API Key Provided', ['status' => 401]);
        }
        $url = 'https://api.openai.com/v1/images/generations';
        $headers = [
            'Authorization' => 'Bearer ' . $api_key,
            'Content-Type' => 'application/json',
        ];
        $body = [
            'prompt' => $paramaters['prompt'],
            'n' => isset($paramaters['number']) ? (int) $paramaters['number'] : 4,
            'size' => isset($paramaters['size']) ? (string) $paramaters['size'] : '512x512',
            'response_format' => 'b64_json',
            'user' => strval(get_current_user_id()),
        ];
        $args = [
            'headers' => $headers,
            'body' => json_encode($body),
            'method' => 'POST',
            'timeout' => 60,
            'data_format' => 'body',
        ];

        $api_request = wp_remote_post($url, $args);
        $response = json_decode($api_request['body'], true);
        return  $response;
    }
    public function image_generation_permission_check() {
        return current_user_can('edit_posts');
    }
    private function get_openai_api_key() {
        $api_key = get_option('bdt_openai_api_key');
        if (!empty($api_key)) {
            return $api_key;
        }
        return false;
    }
}
