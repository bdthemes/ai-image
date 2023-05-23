<?php
class Admin_Settings_Page {
    public function __construct() {
        add_action('admin_init', [$this, 'admin_settings_page_init']);
        add_action('admin_menu', [$this, 'add_openai_menu_page']);
    }
    public function add_openai_menu_page() {
        add_options_page('AI Image', __('AI Image', 'ai-image'), 'manage_options', 'bdt-ai-image-options', [$this, 'create_admin_page']);
    }
    public function create_admin_page() {
?>
        <div class="wrap">
            <h1><?php _e('AI Image', 'ai-image'); ?></h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('bdt-ai-image-options');
                do_settings_sections('bdt-ai-image-options');
                submit_button();
                ?>
            </form>
        </div>
    <?php
    }

    public function admin_settings_page_init() {
        add_settings_section('bdt_openai_section', 'Openai Setings', [$this, 'openai_settings_section'], 'bdt-ai-image-options');
        add_settings_field('bdt_openai_api_key', __('API Key', 'ai-image'), [$this, 'openai_content_generator_callback'], 'bdt-ai-image-options', 'bdt_openai_section');
        register_setting('bdt-ai-image-options', 'bdt_openai_api_key', ['sanitize_callback' => 'esc_attr']);
    }
    public function openai_settings_section() {
    ?>
        <p>
            <?php _e('Please enter your Openai API key. You can get your API key from <a href="https://beta.openai.com/account/api-keys" target="_blank">here</a>.', 'ai-image'); ?>
            <br>
            <?php _e('Learn more about <a href="https://beta.openai.com/docs/developer-quickstart/your-api-keys" target="_blank">how to use OpenAI API</a>', 'ai-image'); ?>
        </p>
<?php
    }
    public function openai_content_generator_callback() {
        $api_key = get_option('bdt_openai_api_key');
        echo '<input type="text" name="bdt_openai_api_key" value="' . $api_key . '" class="large-text" placeholder="sk-..." />';
    }
}

new Admin_Settings_Page();
