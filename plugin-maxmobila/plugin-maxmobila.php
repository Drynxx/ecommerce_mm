<?php
/**
 * Plugin Name: MaxMobila Outlet Store
 * Plugin URI: https://maxmobila.local
 * Description: Magazin complet și catalog headless MaxMobila, outlet mobilă din Germania. Recreat identic din prototipul MaxMobila cu blocuri Gutenberg vizuale, pagini editabile WordPress, shortcode-uri modulare și WooCommerce.
 * Version: 1.2.0
 * Author: Antigravity
 * Text Domain: maxmobila
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

if ( defined( 'MAXMOBILA_VERSION' ) ) {
    return;
}

// ----------------------------------------------------
// CONSTANTS & DEV SETTINGS
// ----------------------------------------------------
define( 'MAXMOBILA_VERSION', '1.2.0' );
define( 'MAXMOBILA_FILE', __FILE__ );
define( 'MAXMOBILA_PATH', plugin_dir_path( __FILE__ ) );
define( 'MAXMOBILA_URL', plugin_dir_url( __FILE__ ) );
define( 'MAXMOBILA_ASSETS_URL', MAXMOBILA_URL . 'assets/' );

// Dezactivează cache-ul pe mediul local pentru actualizări instantanee
if ( ! defined( 'DONOTCACHEPAGE' ) ) {
    define( 'DONOTCACHEPAGE', true );
}
add_filter( 'wpfc_is_cacheable', '__return_false' );

// Include setul de date inițiale
require_once MAXMOBILA_PATH . 'maxmobila-data.php';

// ----------------------------------------------------
// ACTIVATION & DEACTIVATION HOOKS
// ----------------------------------------------------
register_activation_hook( __FILE__, 'maxmobila_activate_plugin' );
function maxmobila_activate_plugin() {
    // Setează opțiunile implicite
    $default_data = maxmobila_get_default_data();
    if ( ! get_option( 'maxmobila_store_name' ) ) {
        update_option( 'maxmobila_store_name', $default_data['store']['name'] );
        update_option( 'maxmobila_tagline', $default_data['store']['tagline'] );
        update_option( 'maxmobila_phone', $default_data['store']['phone'] );
        update_option( 'maxmobila_phone_raw', $default_data['store']['phoneRaw'] );
        update_option( 'maxmobila_email', $default_data['store']['email'] );
        update_option( 'maxmobila_city', $default_data['store']['city'] );
        update_option( 'maxmobila_address', $default_data['store']['address'] );
        update_option( 'maxmobila_free_ship', $default_data['store']['freeShipOverRON'] );
        update_option( 'maxmobila_warranty', $default_data['store']['warrantyYears'] );
        update_option( 'maxmobila_takeover_frontpage', '1' );
    }

    // Generează paginile implicite dacă nu există
    maxmobila_create_default_pages( false );
}

add_action( 'wp_head', 'maxmobila_add_favicon' );
function maxmobila_add_favicon() {
    $fav = MAXMOBILA_URL . 'assets/favicon.png';
    echo '<link rel="icon" type="image/png" href="' . esc_url( $fav ) . '">' . "\n";
}

// ----------------------------------------------------
// ROUTING & REWRITE RULES (CURATE LINKS PENTRU SOCIAL MEDIA)
// ----------------------------------------------------
add_action( 'init', 'maxmobila_register_product_routes' );
function maxmobila_register_product_routes() {
    add_rewrite_rule( '^produs/([^/]+)/?$', 'index.php?maxmobila_produs=$matches[1]', 'top' );
    if ( get_option( 'maxmobila_rewrite_flushed_v2' ) !== '1' ) {
        flush_rewrite_rules( false );
        update_option( 'maxmobila_rewrite_flushed_v2', '1' );
    }
}

add_filter( 'query_vars', function( $vars ) {
    $vars[] = 'maxmobila_produs';
    return $vars;
} );

add_action( 'template_redirect', function() {
    global $wp_query;
    $prod_id = sanitize_text_field( $_GET['produs'] ?? '' );
    if ( empty( $prod_id ) ) {
        $prod_id = sanitize_text_field( get_query_var( 'maxmobila_produs', '' ) );
    }
    if ( empty( $prod_id ) && ! empty( $_SERVER['REQUEST_URI'] ) ) {
        $req_path = strtok( $_SERVER['REQUEST_URI'], '?' );
        if ( preg_match( '#/produs/([a-zA-Z0-9_-]+)/?$#', $req_path, $m ) ) {
            $prod_id = sanitize_text_field( $m[1] );
        }
    }
    if ( ! empty( $prod_id ) ) {
        set_query_var( 'maxmobila_produs', $prod_id );
        if ( isset( $wp_query ) && is_object( $wp_query ) ) {
            $wp_query->is_404 = false;
        }
        status_header( 200 );
    }
}, 1 );

// ----------------------------------------------------
// DYNAMIC OPEN GRAPH META TAGS (FACEBOOK & WHATSAPP SHARING)
// ----------------------------------------------------
add_action( 'wp_head', 'maxmobila_output_dynamic_opengraph', 2 );
function maxmobila_output_dynamic_opengraph() {
    static $executed = false;
    if ( $executed ) {
        return;
    }
    $executed = true;

    $data = maxmobila_get_active_data();
    $store = $data['store'];
    $products = $data['products'] ?? array();

    // Identifică dacă suntem pe o pagină de produs (/produs/ID sau ?produs=ID)
    $prod_id = sanitize_text_field( $_GET['produs'] ?? '' );
    if ( empty( $prod_id ) ) {
        $prod_id = sanitize_text_field( get_query_var( 'maxmobila_produs', '' ) );
    }
    if ( empty( $prod_id ) && ! empty( $_SERVER['REQUEST_URI'] ) ) {
        $req_path = strtok( $_SERVER['REQUEST_URI'], '?' );
        if ( preg_match( '#/produs/([a-zA-Z0-9_-]+)/?$#', $req_path, $m ) ) {
            $prod_id = sanitize_text_field( $m[1] );
        }
    }

    $found_prod = null;
    if ( ! empty( $prod_id ) ) {
        $needle = strtolower( $prod_id );
        foreach ( $products as $p ) {
            if (
                strtolower( (string) ( $p['id'] ?? '' ) ) === $needle ||
                ( ! empty( $p['wc_id'] ) && strtolower( (string) $p['wc_id'] ) === $needle ) ||
                strtolower( sanitize_title( $p['name'] ?? '' ) ) === $needle
            ) {
                $found_prod = $p;
                break;
            }
        }
    }

    if ( $found_prod ) {
        $p = $found_prod;
        $disc = ( ! empty( $p['newRON'] ) && ! empty( $p['priceRON'] ) && $p['newRON'] > $p['priceRON'] )
            ? round( ( 1 - $p['priceRON'] / $p['newRON'] ) * 100 ) : 0;

        $price_fmt = number_format( (float) $p['priceRON'], 0, ',', '.' ) . ' lei';
        $title = $p['name'] . ' (Germania) — ' . $price_fmt;
        if ( $disc > 0 ) {
            $title .= ' (−' . $disc . '%)';
        }

        $state_labels = array(
            'nou'       => 'Nou (ambalat)',
            'resigilat' => 'Resigilat (verificat)',
            'expus'     => 'Expus în magazin',
            'defecte'   => 'Mici defecte',
        );
        $st_text = $state_labels[ $p['state'] ?? 'nou' ] ?? ucfirst( $p['state'] ?? 'Nou' );

        $desc = 'Preț outlet: ' . $price_fmt . ' | Stare: ' . $st_text . ' | Showroom & Depozit în ' . $store['city'] . '. Rezervă piesa gratuit fără card bancar!';
        if ( ! empty( $p['material'] ) || ! empty( $p['color'] ) ) {
            $desc .= ' Material: ' . $p['material'] . ', Culoare: ' . $p['color'] . '.';
        }

        $img_url = '';
        if ( ! empty( $p['custom_img'] ) ) {
            $img_url = $p['custom_img'];
        } elseif ( ! empty( $p['img'] ) ) {
            $img_url = MAXMOBILA_ASSETS_URL . 'images/' . $p['img'] . '.webp';
        } else {
            $img_url = MAXMOBILA_ASSETS_URL . 'images/logo-maxmobila.png';
        }

        $prod_url = home_url( '/produs/' . $p['id'] );

        echo "\n" . '<!-- MaxMobila Dynamic Open Graph (WhatsApp / Facebook / Social Share) -->' . "\n";
        echo '<meta property="og:type" content="product">' . "\n";
        echo '<meta property="og:title" content="' . esc_attr( $title ) . '">' . "\n";
        echo '<meta property="og:description" content="' . esc_attr( $desc ) . '">' . "\n";
        echo '<meta property="og:image" content="' . esc_url( $img_url ) . '">' . "\n";
        echo '<meta property="og:image:width" content="800">' . "\n";
        echo '<meta property="og:image:height" content="600">' . "\n";
        echo '<meta property="og:url" content="' . esc_url( $prod_url ) . '">' . "\n";
        echo '<meta property="og:site_name" content="' . esc_attr( $store['name'] . ' Outlet' ) . '">' . "\n";
        echo '<meta property="product:price:amount" content="' . esc_attr( $p['priceRON'] ) . '">' . "\n";
        echo '<meta property="product:price:currency" content="RON">' . "\n";
        echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
        echo '<meta name="twitter:title" content="' . esc_attr( $title ) . '">' . "\n";
        echo '<meta name="twitter:description" content="' . esc_attr( $desc ) . '">' . "\n";
        echo '<meta name="twitter:image" content="' . esc_url( $img_url ) . '">' . "\n";
    } else {
        $site_title = $store['name'] . ' Outlet — Mobilă din Germania în ' . $store['city'];
        $site_desc  = 'Mobilă adusă direct din Germania la prețuri de outlet. Vezi pe viu canapelele și paturile în depozitul nostru din ' . $store['city'] . '. Rezervă fără card!';
        $site_img   = MAXMOBILA_ASSETS_URL . 'images/logo-maxmobila.png';

        echo "\n" . '<!-- MaxMobila Store Open Graph -->' . "\n";
        echo '<meta property="og:type" content="website">' . "\n";
        echo '<meta property="og:title" content="' . esc_attr( $site_title ) . '">' . "\n";
        echo '<meta property="og:description" content="' . esc_attr( $site_desc ) . '">' . "\n";
        echo '<meta property="og:image" content="' . esc_url( $site_img ) . '">' . "\n";
        echo '<meta property="og:url" content="' . esc_url( home_url( '/' ) ) . '">' . "\n";
        echo '<meta property="og:site_name" content="' . esc_attr( $store['name'] . ' Outlet' ) . '">' . "\n";
    }
}

// ----------------------------------------------------
// ASSET MANAGEMENT FRONT-END (SCRIPTS & STYLES)
// ----------------------------------------------------
add_action( 'wp_enqueue_scripts', 'maxmobila_enqueue_assets' );
function maxmobila_enqueue_assets() {
    // Încarcă fonturile Google Montserrat și Inter (stil XXXLutz)
    wp_enqueue_style(
        'maxmobila-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap',
        array(),
        null
    );

    // CSS-ul principal MaxMobila
    wp_enqueue_style(
        'maxmobila-styles',
        MAXMOBILA_URL . 'maxmobila-styles.css',
        array(),
        MAXMOBILA_VERSION . '.' . ( file_exists( MAXMOBILA_PATH . 'maxmobila-styles.css' ) ? filemtime( MAXMOBILA_PATH . 'maxmobila-styles.css' ) : time() )
    );

    // JS-ul aplicației MaxMobila
    wp_enqueue_script(
        'maxmobila-app',
        MAXMOBILA_URL . 'maxmobila-app.js',
        array(),
        MAXMOBILA_VERSION . '.' . ( file_exists( MAXMOBILA_PATH . 'maxmobila-app.js' ) ? filemtime( MAXMOBILA_PATH . 'maxmobila-app.js' ) : time() ),
        true
    );

    // Pregătire date active
    $data = maxmobila_get_active_data();

    wp_localize_script( 'maxmobila-app', 'MAXMOBILA_CONFIG', array(
        'pluginUrl' => MAXMOBILA_URL,
        'assetsUrl' => MAXMOBILA_ASSETS_URL . 'images/',
        'ajaxUrl'   => admin_url( 'admin-ajax.php' ),
        'nonce'     => wp_create_nonce( 'maxmobila_nonce' ),
        'homeUrl'   => home_url( '/' ),
    ) );

    // Transmite datele către window
    wp_add_inline_script(
        'maxmobila-app',
        'window.MAXMOBILA_PLUGIN_URL = ' . json_encode( MAXMOBILA_URL ) . ';' .
        'window.MAXMOBILA_ASSETS_URL = ' . json_encode( MAXMOBILA_ASSETS_URL . 'images/' ) . ';' .
        'window.MAXMOBILA_AJAX_URL = ' . json_encode( admin_url( 'admin-ajax.php' ) ) . ';' .
        'window.MAXMOBILA_NONCE = ' . json_encode( wp_create_nonce( 'maxmobila_nonce' ) ) . ';' .
        'window.MAXMOBILA_HOME_URL = ' . json_encode( home_url( '/' ) ) . ';' .
        'window.MAXMOBILA_DATA = ' . json_encode( $data ) . ';',
        'before'
    );
}

// ----------------------------------------------------
// ASSET MANAGEMENT PENTRU EDITORUL GUTENBERG (WYSIWYG)
// ----------------------------------------------------
add_action( 'enqueue_block_editor_assets', 'maxmobila_enqueue_block_editor_assets' );
function maxmobila_enqueue_block_editor_assets() {
    wp_enqueue_style(
        'maxmobila-editor-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap',
        array(),
        null
    );

    wp_enqueue_style(
        'maxmobila-editor-styles',
        MAXMOBILA_URL . 'maxmobila-styles.css',
        array(),
        MAXMOBILA_VERSION . '.' . ( file_exists( MAXMOBILA_PATH . 'maxmobila-styles.css' ) ? filemtime( MAXMOBILA_PATH . 'maxmobila-styles.css' ) : time() )
    );

    wp_enqueue_style(
        'maxmobila-editor-fixes',
        MAXMOBILA_URL . 'maxmobila-editor-fixes.css',
        array( 'maxmobila-editor-styles' ),
        MAXMOBILA_VERSION . '.' . ( file_exists( MAXMOBILA_PATH . 'maxmobila-editor-fixes.css' ) ? filemtime( MAXMOBILA_PATH . 'maxmobila-editor-fixes.css' ) : time() )
    );

    wp_enqueue_script(
        'maxmobila-blocks',
        MAXMOBILA_URL . 'maxmobila-blocks.js',
        array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components' ),
        MAXMOBILA_VERSION . '.' . ( file_exists( MAXMOBILA_PATH . 'maxmobila-blocks.js' ) ? filemtime( MAXMOBILA_PATH . 'maxmobila-blocks.js' ) : time() ),
        true
    );

    $data = maxmobila_get_active_data();
    wp_localize_script( 'maxmobila-blocks', 'MAXMOBILA_BLOCKS_DATA', array(
        'assetsUrl'  => MAXMOBILA_ASSETS_URL . 'images/',
        'store'      => $data['store'],
        'categories' => $data['categories'],
        'states'     => $data['states'],
        'products'   => $data['products'],
        'faq'        => $data['faq'],
    ) );
}

add_filter( 'block_categories_all', function( $categories ) {
    return array_merge(
        array(
            array(
                'slug'  => 'maxmobila',
                'title' => 'MaxMobila Outlet',
                'icon'  => 'store',
            ),
        ),
        $categories
    );
} );

// Asigură că stilurile MaxMobila sunt injectate direct în canvas-ul iframe al editorului Gutenberg (teme FSE / Spectra One)
add_filter( 'block_editor_settings_all', 'maxmobila_inject_editor_styles', 10, 2 );
function maxmobila_inject_editor_styles( $editor_settings, $editor_context ) {
    $main_css  = file_exists( MAXMOBILA_PATH . 'maxmobila-styles.css' ) ? file_get_contents( MAXMOBILA_PATH . 'maxmobila-styles.css' ) : '';
    $fixes_css = file_exists( MAXMOBILA_PATH . 'maxmobila-editor-fixes.css' ) ? file_get_contents( MAXMOBILA_PATH . 'maxmobila-editor-fixes.css' ) : '';

    if ( ! empty( $main_css ) || ! empty( $fixes_css ) ) {
        if ( ! isset( $editor_settings['styles'] ) || ! is_array( $editor_settings['styles'] ) ) {
            $editor_settings['styles'] = array();
        }
        $editor_settings['styles'][] = array(
            'css'            => $main_css . "\n" . $fixes_css,
            '__unstableType' => 'plugin',
        );
    }
    return $editor_settings;
}

add_action( 'admin_init', 'maxmobila_add_editor_styles' );
function maxmobila_add_editor_styles() {
    add_theme_support( 'editor-styles' );
    add_editor_style( MAXMOBILA_URL . 'maxmobila-styles.css' );
    add_editor_style( MAXMOBILA_URL . 'maxmobila-editor-fixes.css' );
}

// ----------------------------------------------------
// PRELUARE DATE ACTIVE (WooCommerce sau Fallback)
// ----------------------------------------------------
function maxmobila_normalize_state_slug( $raw_state, $fallback = 'nou' ) {
    $v = strtolower( trim( (string) $raw_state ) );
    if ( $v === '' ) {
        return $fallback ?: 'nou';
    }
    if ( strpos( $v, 'defect' ) !== false ) {
        return 'defecte';
    }
    if ( strpos( $v, 'resigil' ) !== false ) {
        return 'resigilat';
    }
    if ( strpos( $v, 'expu' ) !== false || strpos( $v, 'expo' ) !== false ) {
        return 'expus';
    }
    if ( strpos( $v, 'nou' ) !== false ) {
        return 'nou';
    }
    return $v;
}

function maxmobila_get_active_data() {
    static $sync_reentry = false;
    $defaults = maxmobila_get_default_data();

    // Actualizează datele magazinului din setările WP
    $defaults['store']['name']            = get_option( 'maxmobila_store_name', $defaults['store']['name'] );
    $defaults['store']['tagline']         = get_option( 'maxmobila_tagline', $defaults['store']['tagline'] );
    $defaults['store']['phone']           = get_option( 'maxmobila_phone', $defaults['store']['phone'] );
    $defaults['store']['phoneRaw']        = get_option( 'maxmobila_phone_raw', $defaults['store']['phoneRaw'] );
    $defaults['store']['email']           = get_option( 'maxmobila_email', $defaults['store']['email'] );
    $defaults['store']['city']            = get_option( 'maxmobila_city', $defaults['store']['city'] );
    $defaults['store']['address']         = get_option( 'maxmobila_address', $defaults['store']['address'] );
    $defaults['store']['freeShipOverRON'] = intval( get_option( 'maxmobila_free_ship', $defaults['store']['freeShipOverRON'] ) );
    $defaults['store']['warrantyYears']   = intval( get_option( 'maxmobila_warranty', $defaults['store']['warrantyYears'] ) );

    // Dacă WooCommerce este activ și are produse publicate, mapăm produsele reale
    if ( class_exists( 'WooCommerce' ) && function_exists( 'wc_get_product' ) ) {
        // Repară automat o singură dată produsele deja importate fără imagini / meta
        if ( ! $sync_reentry && get_option( 'maxmobila_wc_sync_fixed_v2' ) !== '1' && function_exists( 'wc_get_product_id_by_sku' ) ) {
            if ( wc_get_product_id_by_sku( 'm00' ) ) {
                $sync_reentry = true;
                update_option( 'maxmobila_wc_sync_fixed_v2', '1' );
                maxmobila_sync_products_to_woocommerce();
                $sync_reentry = false;
            }
        }

        $default_by_id = array();
        foreach ( $defaults['products'] as $dp ) {
            $default_by_id[ strtolower( (string) $dp['id'] ) ] = $dp;
        }

        $cat_index = array();
        foreach ( $defaults['categories'] as $idx => $cat_item ) {
            $cat_index[ $cat_item['id'] ] = $idx;
        }

        $wc_products = get_posts( array(
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'orderby'        => 'ID',
            'order'          => 'ASC',
        ) );

        if ( ! empty( $wc_products ) ) {
            $mapped_products = array();
            foreach ( $wc_products as $p_post ) {
                $wc_p = wc_get_product( $p_post->ID );
                if ( ! $wc_p ) continue;

                $sku = trim( (string) $wc_p->get_sku() );
                $sku_key = strtolower( $sku );
                $def_p = ( $sku_key !== '' && isset( $default_by_id[ $sku_key ] ) ) ? $default_by_id[ $sku_key ] : null;

                $terms = wp_get_post_terms( $p_post->ID, 'product_cat' );
                $chosen_term = null;
                if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
                    foreach ( $terms as $t ) {
                        if ( $t->slug !== 'uncategorized' && $t->slug !== 'necategorizat' ) {
                            $chosen_term = $t;
                            break;
                        }
                    }
                    if ( ! $chosen_term ) {
                        $chosen_term = $terms[0];
                    }
                }
                if ( $chosen_term ) {
                    $cat_slug = $chosen_term->slug;
                    if ( $cat_slug !== 'uncategorized' && $cat_slug !== 'necategorizat' ) {
                        if ( isset( $cat_index[ $cat_slug ] ) ) {
                            $defaults['categories'][ $cat_index[ $cat_slug ] ]['name'] = $chosen_term->name;
                        } else {
                            $cat_index[ $cat_slug ] = count( $defaults['categories'] );
                            $defaults['categories'][] = array(
                                'id'   => $cat_slug,
                                'name' => $chosen_term->name,
                            );
                        }
                    }
                } else {
                    $cat_slug = $def_p['cat'] ?? 'canapele';
                }

                $raw_state = $wc_p->get_attribute( 'stare' );
                $state = maxmobila_normalize_state_slug( $raw_state, $def_p['state'] ?? 'nou' );

                $material = $wc_p->get_attribute( 'material' );
                if ( ! $material ) {
                    $material = $def_p['material'] ?? '';
                }

                $color = $wc_p->get_attribute( 'culoare' );
                if ( ! $color ) {
                    $color = $def_p['color'] ?? '';
                }

                $dims = $wc_p->get_attribute( 'dimensiuni' );
                if ( ! $dims ) {
                    $dims = get_post_meta( $p_post->ID, '_maxmobila_dims', true );
                }
                if ( ! $dims && $def_p && ! empty( $def_p['dims'] ) ) {
                    $dims = $def_p['dims'];
                }

                $img_id = $wc_p->get_image_id();
                $img_url = '';
                if ( $img_id ) {
                    $img_url = wp_get_attachment_image_url( $img_id, 'large' ) ?: wp_get_attachment_url( $img_id );
                }

                $img_key = get_post_meta( $p_post->ID, '_maxmobila_img', true );
                if ( ! $img_key && $def_p && ! empty( $def_p['img'] ) ) {
                    $img_key = $def_p['img'];
                } elseif ( ! $img_key && preg_match( '/^m(\d+)$/', $sku_key, $mm ) ) {
                    $img_key = 'p' . $mm[1];
                }
                if ( ! $img_key ) {
                    $img_key = 'p00';
                }

                $gallery_urls = array();
                $gallery_ids = $wc_p->get_gallery_image_ids();
                if ( ! empty( $gallery_ids ) ) {
                    foreach ( $gallery_ids as $gid ) {
                        $gurl = wp_get_attachment_image_url( $gid, 'large' ) ?: wp_get_attachment_url( $gid );
                        if ( $gurl ) {
                            $gallery_urls[] = $gurl;
                        }
                    }
                }

                $regular = floatval( $wc_p->get_regular_price() );
                $sale = floatval( $wc_p->get_price() );
                if ( ! $sale ) {
                    $sale = $regular;
                }
                if ( ! $regular || $regular < $sale ) {
                    $regular = $sale;
                }

                $buy_eur = get_post_meta( $p_post->ID, '_maxmobila_buy_eur', true );
                if ( $buy_eur === '' || $buy_eur === false ) {
                    $buy_eur = $def_p['buyEUR'] ?? round( $sale / 15 );
                }

                $stock_qty = $wc_p->is_in_stock() ? ( $wc_p->get_stock_quantity() !== null ? intval( $wc_p->get_stock_quantity() ) : 1 ) : 0;
                $raw_desc = $wc_p->get_description() ?: $wc_p->get_short_description();
                $clean_desc = $raw_desc ? trim( wp_strip_all_tags( $raw_desc ) ) : '';

                $sort_order = get_post_meta( $p_post->ID, '_maxmobila_sort_order', true );
                if ( $sort_order === '' || $sort_order === false ) {
                    $sort_order = 1000 + $p_post->ID;
                }

                $mapped_products[] = array(
                    'id'         => $sku !== '' ? $sku : (string) $wc_p->get_id(),
                    'wc_id'      => $wc_p->get_id(),
                    'cat'        => $cat_slug,
                    'name'       => $wc_p->get_name(),
                    'material'   => $material ?: null,
                    'color'      => $color ?: null,
                    'dims'       => $dims ?: null,
                    'state'      => $state,
                    'newRON'     => round( $regular ),
                    'priceRON'   => round( $sale ),
                    'buyEUR'     => floatval( $buy_eur ),
                    'stock'      => $stock_qty,
                    'img'        => $img_key,
                    'custom_img' => $img_url ?: '',
                    'gallery'    => $gallery_urls,
                    'desc'       => $clean_desc,
                    'defect'     => get_post_meta( $p_post->ID, '_maxmobila_defect', true ) ?: ( $def_p['defect'] ?? null ),
                    '_order'     => intval( $sort_order ),
                );
            }

            if ( ! empty( $mapped_products ) ) {
                usort( $mapped_products, function( $a, $b ) {
                    return $a['_order'] <=> $b['_order'];
                } );
                foreach ( $mapped_products as &$mp ) {
                    unset( $mp['_order'] );
                }
                unset( $mp );
                $defaults['products'] = $mapped_products;
            }
        }
    }

    return $defaults;
}

// ----------------------------------------------------
// HELPERE PENTRU RENDERING HTML & PRODUSE
// ----------------------------------------------------
function maxmobila_get_img_html( $p, $class = '' ) {
    $alt = esc_attr( $p['name'] ?? 'Produs MaxMobila' );
    $cls = $class ? ' class="' . esc_attr( $class ) . '"' : '';

    if ( ! empty( $p['custom_img'] ) ) {
        return '<img src="' . esc_url( $p['custom_img'] ) . '" alt="' . $alt . '" loading="lazy"' . $cls . '>';
    }

    $img_key = $p['img'] ?? 'p00';
    $img_file = MAXMOBILA_PATH . 'assets/images/' . $img_key . '.webp';
    if ( file_exists( $img_file ) ) {
        $url = MAXMOBILA_ASSETS_URL . 'images/' . $img_key . '.webp';
        return '<img src="' . esc_url( $url ) . '" alt="' . $alt . '" loading="lazy"' . $cls . '>';
    }

    return '<svg viewBox="0 0 400 300" class="ph-svg"' . $cls . '><rect width="400" height="300" fill="#f0ede6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="20">' . esc_html( $p['name'] ?? 'MaxMobila' ) . '</text></svg>';
}

function maxmobila_format_lei( $amount ) {
    return number_format( (float) $amount, 0, ',', '.' ) . ' lei';
}

function maxmobila_get_st_badge( $p ) {
    $st = $p['state'] ?? 'nou';
    $labels = array(
        'nou'       => 'Nou',
        'resigilat' => 'Resigilat',
        'expus'     => 'Expus',
        'defecte'   => 'Mici defecte',
    );
    $label = $labels[ $st ] ?? ucfirst( $st );
    return '<span class="st ' . esc_attr( $st ) . '">' . esc_html( $label ) . '</span>';
}

function maxmobila_render_card_html( $p, $cat_map = array() ) {
    $disc = 0;
    if ( ! empty( $p['newRON'] ) && ! empty( $p['priceRON'] ) && $p['newRON'] > $p['priceRON'] ) {
        $disc = round( ( 1 - $p['priceRON'] / $p['newRON'] ) * 100 );
    }

    $cat_name = isset( $cat_map[ $p['cat'] ] ) ? $cat_map[ $p['cat'] ] : ucfirst( $p['cat'] ?? '' );
    $meta_parts = array_filter( array( $cat_name, $p['material'] ?? '', $p['color'] ?? '' ) );
    $meta_str = esc_html( implode( ' · ', $meta_parts ) );
    if ( ! empty( $p['dims'] ) ) {
        $meta_str .= '<br>' . esc_html( $p['dims'] );
    }

    $cart_icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.5 3h2.7l2.4 12.2a2 2 0 0 0 2 1.6h9.5a2 2 0 0 0 2-1.6L22.5 7H6"/></svg>';

    $html  = '<article class="pc">';
    $html .= '<a class="ph" href="#/produs/' . esc_attr( $p['id'] ) . '">' . maxmobila_get_img_html( $p ) . '</a>';
    $html .= '<span class="tl">' . maxmobila_get_st_badge( $p ) . '</span>';
    $html .= '<span class="tr off">−' . $disc . '%</span>';
    $html .= '<div class="bd">';
    $html .= '<span class="pc-brand">COLECȚIA GERMANIA</span>';
    $html .= '<a href="#/produs/' . esc_attr( $p['id'] ) . '"><h3>' . esc_html( $p['name'] ) . '</h3></a>';
    $html .= '<div class="meta">' . $meta_str . '</div>';
    $html .= '<div class="pr">';
    $html .= '<div>';
    $html .= '<div class="was">Preț nou: <s>' . maxmobila_format_lei( $p['newRON'] ?? 0 ) . '</s></div>';
    $html .= '<div class="price num">' . maxmobila_format_lei( $p['priceRON'] ?? 0 ) . '</div>';
    $html .= '</div>';
    $html .= '<div class="pc-acts">';
    $html .= '<button type="button" class="pc-fav" onclick="toggleFav(' . "'" . esc_attr( $p['id'] ) . "'" . ',this)" aria-label="Favorite" title="Adaugă la favorite">♡</button>';
    $html .= '</div>';
    $html .= '</div>';
    $html .= '</div>';
    $html .= '</article>';

    return $html;
}

// ----------------------------------------------------
// SHORTCODE-URI MODULARE & CALLBACKS PENTRU BLOCURI
// ----------------------------------------------------

/**
 * [maxmobila_hero]
 * Hero banner cu colaj și statistici
 */
add_shortcode( 'maxmobila_hero', 'maxmobila_hero_shortcode' );
function maxmobila_hero_shortcode( $atts = array() ) {
    $atts = shortcode_atts( array(
        'eyebrow'   => 'Direct din Germania',
        'title'     => 'Mobilă nemțească.<br><em>Preț de outlet.</em>',
        'lead'      => 'Canapele, paturi, mese și dulapuri din surplusul magazinelor din Germania. Fiecare piesă are starea scrisă clar: nou, resigilat, expus sau cu mici defecte.',
        'btn_text'  => 'Vezi reducerile',
        'btn_link'  => '#/produse?sort=disc',
        'btn2_text' => 'Toate produsele',
        'btn2_link' => '#/produse',
    ), (array) $atts, 'maxmobila_hero' );

    $data = maxmobila_get_active_data();
    $products = $data['products'] ?? array();
    $warranty = $data['store']['warrantyYears'] ?? 2;

    $discs = array();
    foreach ( $products as $p ) {
        if ( ! empty( $p['newRON'] ) && ! empty( $p['priceRON'] ) && $p['newRON'] > $p['priceRON'] ) {
            $discs[] = round( ( 1 - $p['priceRON'] / $p['newRON'] ) * 100 );
        }
    }
    $avg_disc = ! empty( $discs ) ? round( array_sum( $discs ) / count( $discs ) ) : 45;

    $p_by_id = array();
    foreach ( $products as $p ) {
        $p_by_id[ $p['id'] ] = $p;
    }
    $hero_ids = array( 'm00', 'm43', 'm04' );
    $hero_items = array();
    foreach ( $hero_ids as $hid ) {
        if ( isset( $p_by_id[ $hid ] ) ) {
            $hero_items[] = $p_by_id[ $hid ];
        }
    }
    if ( count( $hero_items ) < 3 ) {
        $hero_items = array_slice( $products, 0, 3 );
    }

    $arrow_icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';

    ob_start();
    ?>
    <section class="hero">
      <div class="wrap g">
        <div>
          <div class="eyebrow"><?php echo esc_html( $atts['eyebrow'] ); ?></div>
          <h1><?php echo wp_kses_post( $atts['title'] ); ?></h1>
          <p class="lead"><?php echo esc_html( $atts['lead'] ); ?></p>
          <div class="ctas">
            <a class="btn red" href="<?php echo esc_url( $atts['btn_link'] ); ?>"><?php echo esc_html( $atts['btn_text'] ); ?> <?php echo $arrow_icon; ?></a>
            <a class="btn outl" href="<?php echo esc_url( $atts['btn2_link'] ); ?>"><?php echo esc_html( $atts['btn2_text'] ); ?></a>
          </div>
          <div class="hstats">
            <div><b class="num"><?php echo count( $products ); ?></b><span>produse în stoc</span></div>
            <div><b class="num">−<?php echo $avg_disc; ?>%</b><span>reducere medie</span></div>
            <div><b><?php echo intval( $warranty ); ?> ani</b><span>garanție</span></div>
          </div>
        </div>
        <div class="collage">
          <?php foreach ( $hero_items as $i => $hp ) : 
            $h_new = floatval( $hp['newRON'] ?? 0 );
            $h_pri = floatval( $hp['priceRON'] ?? 0 );
            $hdisc = ( $h_new > 0 && $h_pri > 0 && $h_new > $h_pri ) ? round( ( 1 - $h_pri / $h_new ) * 100 ) : 0;
          ?>
            <a class="tile <?php echo $i === 0 ? 'big' : ''; ?>" href="#/produs/<?php echo esc_attr( $hp['id'] ); ?>">
              <?php echo maxmobila_get_img_html( $hp ); ?>
              <?php if ( $hdisc > 0 ) : ?><span class="off">−<?php echo $hdisc; ?>%</span><?php endif; ?>
              <span class="tag">
                <?php if ( $h_new > $h_pri ) : ?><small><?php echo maxmobila_format_lei( $h_new ); ?></small><?php endif; ?>
                <b class="num"><?php echo maxmobila_format_lei( $h_pri ); ?></b>
              </span>
            </a>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
    <?php
    return ob_get_clean();
}

/**
 * [maxmobila_categorii]
 * Grilă categorii
 */
add_shortcode( 'maxmobila_categorii', 'maxmobila_categorii_shortcode' );
function maxmobila_categorii_shortcode( $atts = array() ) {
    $atts = shortcode_atts( array(
        'title'    => 'Categorii',
        'subtitle' => 'Alege camera, noi avem piesa.',
    ), (array) $atts, 'maxmobila_categorii' );

    $data = maxmobila_get_active_data();
    $categories = $data['categories'] ?? array();
    $products = $data['products'] ?? array();

    $by_cat = array();
    foreach ( $products as $p ) {
        $by_cat[ $p['cat'] ][] = $p;
    }

    ob_start();
    ?>
    <section class="sec white">
      <div class="wrap">
        <div class="sh">
          <div>
            <h2><?php echo esc_html( $atts['title'] ); ?></h2>
            <p><?php echo esc_html( $atts['subtitle'] ); ?></p>
          </div>
          <a class="more" href="#/produse">Toate cele <?php echo count( $products ); ?> de produse</a>
        </div>
        <div class="catgrid">
          <?php foreach ( $categories as $c ) : 
            $cat_prods = $by_cat[ $c['id'] ] ?? array();
            $count = count( $cat_prods );
            $first_prod = ! empty( $cat_prods ) ? $cat_prods[0] : ( $products[0] ?? null );
            $min_price = $count > 0 ? min( array_column( $cat_prods, 'priceRON' ) ) : 0;
          ?>
            <a class="cat" href="#/produse?cat=<?php echo esc_attr( $c['id'] ); ?>">
              <span class="im"><?php echo $first_prod ? maxmobila_get_img_html( $first_prod ) : ''; ?></span>
              <b><?php echo esc_html( $c['name'] ); ?></b>
              <span><?php echo $count > 0 ? $count . ' produse · de la ' . maxmobila_format_lei( $min_price ) : 'În curând'; ?></span>
            </a>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
    <?php
    return ob_get_clean();
}

/**
 * [maxmobila_top_reduceri]
 * Produse cu cele mai mari reduceri
 */
add_shortcode( 'maxmobila_top_reduceri', 'maxmobila_top_reduceri_shortcode' );
function maxmobila_top_reduceri_shortcode( $atts = array() ) {
    $atts = shortcode_atts( array(
        'title'    => 'Cele mai mari reduceri',
        'subtitle' => 'Față de prețul nou din Germania.',
        'limit'    => 8,
    ), (array) $atts, 'maxmobila_top_reduceri' );

    $data = maxmobila_get_active_data();
    $categories = $data['categories'] ?? array();
    $products = $data['products'] ?? array();

    $cat_map = array();
    foreach ( $categories as $c ) {
        $cat_map[ $c['id'] ] = $c['name'];
    }

    foreach ( $products as &$p ) {
        $p['disc'] = ( ! empty( $p['newRON'] ) && ! empty( $p['priceRON'] ) && $p['newRON'] > $p['priceRON'] )
            ? round( ( 1 - $p['priceRON'] / $p['newRON'] ) * 100 )
            : 0;
    }
    unset( $p );

    usort( $products, function( $a, $b ) {
        return ( $b['disc'] ?? 0 ) <=> ( $a['disc'] ?? 0 );
    } );

    $top_products = array_slice( $products, 0, intval( $atts['limit'] ) );

    ob_start();
    ?>
    <section class="sec">
      <div class="wrap">
        <div class="sh">
          <div>
            <h2><?php echo esc_html( $atts['title'] ); ?></h2>
            <p><?php echo esc_html( $atts['subtitle'] ); ?></p>
          </div>
          <a class="more" href="#/produse?sort=disc">Vezi toate</a>
        </div>
        <div class="grid">
          <?php foreach ( $top_products as $p ) : ?>
            <?php echo maxmobila_render_card_html( $p, $cat_map ); ?>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
    <?php
    return ob_get_clean();
}

/**
 * [maxmobila_stari]
 * Cardurile explicative pentru stările produselor
 */
add_shortcode( 'maxmobila_stari', 'maxmobila_stari_shortcode' );
function maxmobila_stari_shortcode( $atts = array() ) {
    $atts = shortcode_atts( array(
        'title'    => 'Știi exact ce cumperi',
        'subtitle' => 'Fiecare produs are una din cele 4 stări. Filtrezi după ea în catalog.',
    ), (array) $atts, 'maxmobila_stari' );

    $data = maxmobila_get_active_data();
    $states = $data['states'] ?? array();
    $products = $data['products'] ?? array();

    $by_st = array();
    foreach ( $products as $p ) {
        $st = $p['state'] ?? 'nou';
        $by_st[ $st ] = ( $by_st[ $st ] ?? 0 ) + 1;
    }

    $arrow_icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';

    ob_start();
    ?>
    <section class="sec white">
      <div class="wrap">
        <div class="sh">
          <div>
            <h2><?php echo esc_html( $atts['title'] ); ?></h2>
            <p><?php echo esc_html( $atts['subtitle'] ); ?></p>
          </div>
        </div>
        <div class="states">
          <?php foreach ( $states as $s ) : 
            $count = $by_st[ $s['id'] ] ?? 0;
          ?>
            <a href="#/produse?st=<?php echo esc_attr( $s['id'] ); ?>">
              <span class="st <?php echo esc_attr( $s['id'] ); ?>"><?php echo esc_html( $s['name'] ); ?></span>
              <b><?php echo esc_html( $s['short'] ); ?></b>
              <p><?php echo esc_html( $s['desc'] ); ?></p>
              <span class="cnt"><?php echo $count; ?> produse <?php echo $arrow_icon; ?></span>
            </a>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
    <?php
    return ob_get_clean();
}

/**
 * [maxmobila_showroom_banner]
 * Banner showroom & telefon
 */
add_shortcode( 'maxmobila_showroom_banner', 'maxmobila_showroom_banner_shortcode' );
function maxmobila_showroom_banner_shortcode( $atts = array() ) {
    $data = maxmobila_get_active_data();
    $city = $data['store']['city'] ?? 'Satu Mare';
    $phone = $data['store']['phone'] ?? '+40 700 000 000';
    $phone_raw = $data['store']['phoneRaw'] ?? '+40700000000';

    $atts = shortcode_atts( array(
        'eyebrow'  => 'Showroom ' . $city,
        'title'    => 'Vezi mobila pe viu înainte să o cumperi',
        'lead'     => 'Toate produsele sunt în depozitul nostru. Sună, programăm vizita și testezi canapeaua înainte să plătești.',
        'phone'    => $phone,
        'btn_text' => 'Sună acum',
        'btn2_text'=> 'Programează vizita',
    ), (array) $atts, 'maxmobila_showroom_banner' );

    ob_start();
    ?>
    <section class="sec">
      <div class="wrap">
        <div class="band">
          <div>
            <div class="eyebrow" style="color:var(--gold)"><?php echo esc_html( $atts['eyebrow'] ); ?></div>
            <h2><?php echo esc_html( $atts['title'] ); ?></h2>
            <p><?php echo esc_html( $atts['lead'] ); ?></p>
          </div>
          <div>
            <div class="ph"><?php echo esc_html( $atts['phone'] ); ?></div>
            <div class="row">
              <a class="btn red" href="tel:<?php echo esc_attr( $phone_raw ); ?>"><?php echo esc_html( $atts['btn_text'] ); ?></a>
              <a class="btn outl" href="#/contact" style="background:transparent;color:#fff;border-color:#fff"><?php echo esc_html( $atts['btn2_text'] ); ?></a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <?php
    return ob_get_clean();
}

/**
 * [maxmobila_faq]
 * Acordeon FAQ
 */
add_shortcode( 'maxmobila_faq', 'maxmobila_faq_shortcode' );
function maxmobila_faq_shortcode( $atts = array() ) {
    $atts = shortcode_atts( array(
        'title' => 'Întrebări frecvente',
    ), (array) $atts, 'maxmobila_faq' );

    $data = maxmobila_get_active_data();
    $faq = $data['faq'] ?? array();

    ob_start();
    ?>
    <section class="sec white" id="faq">
      <div class="wrap">
        <div class="sh">
          <div>
            <h2><?php echo esc_html( $atts['title'] ); ?></h2>
          </div>
        </div>
        <div class="faq">
          <?php foreach ( $faq as $i => $item ) : ?>
            <details class="card" <?php echo $i === 0 ? 'open' : ''; ?>>
              <summary><?php echo esc_html( $item[0] ); ?></summary>
              <div><?php echo esc_html( $item[1] ); ?></div>
            </details>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
    <?php
    return ob_get_clean();
}

/**
 * [maxmobila_catalog]
 * Catalog interactiv cu filtre și produse
 */
add_shortcode( 'maxmobila_catalog', 'maxmobila_catalog_shortcode' );
add_shortcode( 'maxmobila_produse', 'maxmobila_catalog_shortcode' );
function maxmobila_catalog_shortcode( $atts = array() ) {
    $atts = shortcode_atts( array(
        'cat'   => '',
        'st'    => '',
        'sort'  => 'rec',
    ), (array) $atts, 'maxmobila_catalog' );

    $data = maxmobila_get_active_data();
    $categories = $data['categories'] ?? array();
    $states = $data['states'] ?? array();
    $products = $data['products'] ?? array();

    $cat_map = array();
    foreach ( $categories as $c ) {
        $cat_map[ $c['id'] ] = $c['name'];
    }

    $filtered = array();
    foreach ( $products as $p ) {
        if ( ! empty( $atts['cat'] ) && ( $p['cat'] ?? '' ) !== $atts['cat'] ) {
            continue;
        }
        if ( ! empty( $atts['st'] ) && ( $p['state'] ?? '' ) !== $atts['st'] ) {
            continue;
        }
        $filtered[] = $p;
    }

    ob_start();
    ?>
    <div class="wrap shop maxmobila-catalog-root">
      <aside class="filters">
        <h4>Categorie</h4>
        <button class="opt on" onclick="qset('cat','')">Toate <em><?php echo count( $products ); ?></em></button>
        <?php foreach ( $categories as $c ) : 
          $c_count = count( array_filter( $products, function($x) use ($c) { return ($x['cat'] ?? '') === $c['id']; } ) );
        ?>
          <button class="opt" onclick="qset('cat','<?php echo esc_attr( $c['id'] ); ?>')">
            <?php echo esc_html( $c['name'] ); ?> <em><?php echo $c_count; ?></em>
          </button>
        <?php endforeach; ?>

        <h4>Stare</h4>
        <button class="opt on" onclick="qset('st','')">Oricare</button>
        <?php foreach ( $states as $s ) : 
          $s_count = count( array_filter( $products, function($x) use ($s) { return ($x['state'] ?? '') === $s['id']; } ) );
        ?>
          <button class="opt" onclick="qset('st','<?php echo esc_attr( $s['id'] ); ?>')">
            <?php echo esc_html( $s['name'] ); ?> <em><?php echo $s_count; ?></em>
          </button>
        <?php endforeach; ?>

        <h4>Buget</h4>
        <button class="opt on" onclick="qset('max','')">Oricât</button>
        <button class="opt" onclick="qset('max','300')">până la 300 lei</button>
        <button class="opt" onclick="qset('max','800')">până la 800 lei</button>
        <button class="opt" onclick="qset('max','1500')">până la 1.500 lei</button>
        <button class="opt" onclick="qset('max','3000')">până la 3.000 lei</button>
      </aside>

      <div>
        <div class="toolbar">
          <b><?php echo count( $filtered ); ?> produse</b>
          <select class="inp" id="sort" onchange="qset('sort',this.value)">
            <option value="rec">Sortare: Recomandate</option>
            <option value="disc">Sortare: Reducere maximă</option>
            <option value="pa">Sortare: Preț crescător</option>
            <option value="pd">Sortare: Preț descrescător</option>
          </select>
        </div>

        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">
          <?php foreach ( $filtered as $p ) : ?>
            <?php echo maxmobila_render_card_html( $p, $cat_map ); ?>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * [maxmobila_contact_form]
 * Formular de contact și casetă showroom
 */
add_shortcode( 'maxmobila_contact_form', 'maxmobila_contact_form_shortcode' );
function maxmobila_contact_form_shortcode( $atts = array() ) {
    $atts = shortcode_atts( array(
        'title' => 'Programează o vizită sau pune o întrebare',
    ), (array) $atts, 'maxmobila_contact_form' );

    $data = maxmobila_get_active_data();
    $store = $data['store'];
    $pin_icon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';

    ob_start();
    ?>
    <section class="sec" style="padding-top:10px">
      <div class="wrap two" style="padding-block:0">
        <div class="panel">
          <h3><?php echo esc_html( $atts['title'] ); ?></h3>
          <form class="frm" onsubmit="event.preventDefault();maxmobilaSubmitContact(this)">
            <div>
              <label for="c-n">Nume <i>*</i></label>
              <input id="c-n" class="inp" required placeholder="Maria Ionescu">
            </div>
            <div>
              <label for="c-t">Telefon <i>*</i></label>
              <input id="c-t" class="inp" required placeholder="07xx xxx xxx">
            </div>
            <div class="full">
              <label for="c-s">Subiect</label>
              <select id="c-s" class="inp">
                <option>Vreau să văd un produs în showroom</option>
                <option>Întrebare despre un produs</option>
                <option>Livrare / montaj</option>
                <option>Altceva</option>
              </select>
            </div>
            <div class="full">
              <label for="c-m">Mesaj</label>
              <textarea id="c-m" class="inp" rows="4" placeholder="Ex: aș vrea să văd colțarul Bruno sâmbătă dimineață"></textarea>
            </div>
            <div class="full">
              <button type="submit" class="btn red block">Trimite mesajul</button>
            </div>
          </form>
        </div>
        <aside class="panel" style="display:grid;gap:14px">
          <div>
            <div class="eyebrow">Telefon</div>
            <div style="font:900 24px var(--fd);user-select:all"><?php echo esc_html( $store['phone'] ); ?></div>
          </div>
          <div>
            <div class="eyebrow">Email</div>
            <div style="font-weight:800;user-select:all"><?php echo esc_html( $store['email'] ); ?></div>
          </div>
          <div>
            <div class="eyebrow">Adresă Showroom & Depozit</div>
            <div style="font-weight:700"><?php echo esc_html( $store['address'] ); ?></div>
          </div>
          <div>
            <div class="eyebrow">Program de lucru</div>
            <div>Luni–Vineri: 09:00 – 18:00<br>Sâmbătă: 09:00 – 14:00<br>Duminică: Închis</div>
          </div>
          <a class="btn outl" href="https://www.google.com/maps/search/?api=1&query=<?php echo urlencode($store['city'] . ' ' . $store['address']); ?>" target="_blank" rel="noopener">
            <?php echo $pin_icon; ?> Deschide locația în Google Maps
          </a>
        </aside>
      </div>
    </section>
    <?php
    return ob_get_clean();
}

/**
 * [maxmobila_cos]
 * Coș de cumpărături interactiv
 */
add_shortcode( 'maxmobila_cos', 'maxmobila_cos_shortcode' );
function maxmobila_cos_shortcode( $atts = array() ) {
    ob_start();
    ?>
    <div id="maxmobila-cos-embed" class="maxmobila-auto-mount" data-view="cos">
      <div style="text-align:center;padding:50px 20px;">
        <p>Se încarcă coșul de cumpărături...</p>
      </div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * [maxmobila_checkout]
 * Formular checkout interactiv
 */
add_shortcode( 'maxmobila_checkout', 'maxmobila_checkout_shortcode' );
function maxmobila_checkout_shortcode( $atts = array() ) {
    ob_start();
    ?>
    <div id="maxmobila-checkout-embed" class="maxmobila-auto-mount" data-view="checkout">
      <div style="text-align:center;padding:50px 20px;">
        <p>Se încarcă formularul de finalizare comandă...</p>
      </div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * [maxmobila_shop]
 * Magazin complet integrat (container SPA complet)
 */
add_shortcode( 'maxmobila_shop', 'maxmobila_shop_shortcode' );
function maxmobila_shop_shortcode( $atts = array() ) {
    ob_start();
    ?>
    <div id="maxmobila-app-root" class="maxmobila-embedded">
      <div class="promo"><div class="wrap" id="promo"></div></div>
      <header class="hdr">
        <div class="wrap row" id="hdr">
          <a class="logo" href="#/acasa" aria-label="MaxMobila, acasă">
            <img src="<?php echo esc_url( MAXMOBILA_ASSETS_URL . 'images/logo-maxmobila.png' ); ?>" alt="MaxMobila Outlet" class="logo-img" width="220" height="54" loading="eager">
          </a>
        </div>
        <nav class="cats"><div class="wrap" id="cats"></div></nav>
      </header>
      <main id="view"></main>
      <footer id="ftr">
        <div class="wrap"><div class="cols">
          <div>
            <a class="logo" href="#/acasa" aria-label="MaxMobila, acasă">
              <img src="<?php echo esc_url( MAXMOBILA_ASSETS_URL . 'images/logo-maxmobila-white.png' ); ?>" alt="MaxMobila Outlet" class="logo-img" width="220" height="54" loading="lazy">
            </a>
            <p style="font-size:14px;max-width:320px;margin-top:14px">Mobilă adusă direct din Germania: surplus de stoc, colecții trecute, retururi și expoziție. Showroom și depozit în Satu Mare.</p>
          </div>
        </div></div>
      </footer>
      <div class="toast" id="toast" role="status"></div>
    </div>
    <?php
    return ob_get_clean();
}

// ----------------------------------------------------
// ÎNREGISTRARE BLOCURI GUTENBERG (SERVER-SIDE RENDER)
// ----------------------------------------------------
add_action( 'init', 'maxmobila_register_gutenberg_blocks' );
function maxmobila_register_gutenberg_blocks() {
    wp_register_style(
        'maxmobila-editor-styles',
        MAXMOBILA_URL . 'maxmobila-styles.css',
        array(),
        MAXMOBILA_VERSION
    );
    wp_register_style(
        'maxmobila-editor-fixes',
        MAXMOBILA_URL . 'maxmobila-editor-fixes.css',
        array( 'maxmobila-editor-styles' ),
        MAXMOBILA_VERSION
    );

    $editor_styles = array( 'maxmobila-editor-styles', 'maxmobila-editor-fixes' );

    register_block_type( 'maxmobila/hero', array(
        'render_callback' => 'maxmobila_hero_shortcode',
        'editor_style'    => $editor_styles,
        'attributes'      => array(
            'eyebrow'   => array( 'type' => 'string', 'default' => 'Direct din Germania' ),
            'title'     => array( 'type' => 'string', 'default' => 'Mobilă nemțească.<br><em>Preț de outlet.</em>' ),
            'lead'      => array( 'type' => 'string', 'default' => 'Canapele, paturi, mese și dulapuri din surplusul magazinelor din Germania. Fiecare piesă are starea scrisă clar: nou, resigilat, expus sau cu mici defecte.' ),
            'btn_text'  => array( 'type' => 'string', 'default' => 'Vezi reducerile' ),
            'btn_link'  => array( 'type' => 'string', 'default' => '#/produse?sort=disc' ),
            'btn2_text' => array( 'type' => 'string', 'default' => 'Toate produsele' ),
            'btn2_link' => array( 'type' => 'string', 'default' => '#/produse' ),
        ),
    ) );

    register_block_type( 'maxmobila/categorii', array(
        'render_callback' => 'maxmobila_categorii_shortcode',
        'editor_style'    => $editor_styles,
        'attributes'      => array(
            'title'    => array( 'type' => 'string', 'default' => 'Categorii' ),
            'subtitle' => array( 'type' => 'string', 'default' => 'Alege camera, noi avem piesa.' ),
        ),
    ) );

    register_block_type( 'maxmobila/top-reduceri', array(
        'render_callback' => 'maxmobila_top_reduceri_shortcode',
        'editor_style'    => $editor_styles,
        'attributes'      => array(
            'title'    => array( 'type' => 'string', 'default' => 'Cele mai mari reduceri' ),
            'subtitle' => array( 'type' => 'string', 'default' => 'Față de prețul nou din Germania.' ),
            'limit'    => array( 'type' => 'number', 'default' => 8 ),
        ),
    ) );

    register_block_type( 'maxmobila/stari', array(
        'render_callback' => 'maxmobila_stari_shortcode',
        'editor_style'    => $editor_styles,
        'attributes'      => array(
            'title'    => array( 'type' => 'string', 'default' => 'Știi exact ce cumperi' ),
            'subtitle' => array( 'type' => 'string', 'default' => 'Fiecare produs are una din cele 4 stări. Filtrezi după ea în catalog.' ),
        ),
    ) );

    register_block_type( 'maxmobila/showroom-banner', array(
        'render_callback' => 'maxmobila_showroom_banner_shortcode',
        'editor_style'    => $editor_styles,
        'attributes'      => array(
            'eyebrow'  => array( 'type' => 'string', 'default' => 'Showroom Satu Mare' ),
            'title'    => array( 'type' => 'string', 'default' => 'Vezi mobila pe viu înainte să o cumperi' ),
            'lead'     => array( 'type' => 'string', 'default' => 'Toate produsele sunt în depozitul nostru. Sună, programăm vizita și testezi canapeaua înainte să plătești.' ),
            'phone'    => array( 'type' => 'string', 'default' => '+40 700 000 000' ),
            'btn_text' => array( 'type' => 'string', 'default' => 'Sună acum' ),
            'btn2_text'=> array( 'type' => 'string', 'default' => 'Programează vizita' ),
        ),
    ) );

    register_block_type( 'maxmobila/faq', array(
        'render_callback' => 'maxmobila_faq_shortcode',
        'editor_style'    => $editor_styles,
        'attributes'      => array(
            'title' => array( 'type' => 'string', 'default' => 'Întrebări frecvente' ),
        ),
    ) );

    register_block_type( 'maxmobila/catalog', array(
        'render_callback' => 'maxmobila_catalog_shortcode',
        'editor_style'    => $editor_styles,
        'attributes'      => array(
            'title'         => array( 'type' => 'string', 'default' => 'Toate produsele' ),
            'preview_mode'  => array( 'type' => 'string', 'default' => 'grid' ),
            'preview_count' => array( 'type' => 'number', 'default' => 6 ),
        ),
    ) );

    register_block_type( 'maxmobila/contact-form', array(
        'render_callback' => 'maxmobila_contact_form_shortcode',
        'editor_style'    => $editor_styles,
        'attributes'      => array(
            'title' => array( 'type' => 'string', 'default' => 'Programează o vizită sau pune o întrebare' ),
        ),
    ) );

    register_block_type( 'maxmobila/cos', array(
        'render_callback' => 'maxmobila_cos_shortcode',
        'editor_style'    => $editor_styles,
    ) );

    register_block_type( 'maxmobila/checkout', array(
        'render_callback' => 'maxmobila_checkout_shortcode',
        'editor_style'    => $editor_styles,
    ) );
}

// ----------------------------------------------------
// GENERATOR PAGINI EDITABILE WORDPRESS (CU BLOCURI GUTENBERG VIZUALE)
// ----------------------------------------------------
function maxmobila_create_default_pages( $force_reset = false ) {
    $pages_to_create = array(
        'acasa' => array(
            'title'     => 'Acasă',
            'slug'      => 'acasa',
            'template'  => 'templates/full-shop.php',
            'is_front'  => true,
            'content'   => '<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px"}}} -->' . "
" .
                           '<p style="font-size:16px">Bine ai venit la MaxMobila Outlet — mobilier german de calitate superioară la prețuri reduse cu până la 70%!</p>' . "
" .
                           '<!-- /wp:paragraph -->' . "

" .
                           '<!-- wp:maxmobila/hero /-->' . "

" .
                           '<!-- wp:maxmobila/categorii /-->' . "

" .
                           '<!-- wp:maxmobila/top-reduceri {"limit":8} /-->' . "

" .
                           '<!-- wp:maxmobila/stari /-->' . "

" .
                           '<!-- wp:maxmobila/showroom-banner /-->' . "

" .
                           '<!-- wp:maxmobila/faq /-->',
        ),
        'magazin' => array(
            'title'     => 'Magazin',
            'slug'      => 'magazin',
            'template'  => 'templates/full-shop.php',
            'content'   => '<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px"}}} -->' . "
" .
                           '<p style="font-size:16px">Toate piesele de mobilier din catalogul nostru provin direct din surplusul și colecțiile magazinelor din Germania. Fiecare piesă este verificată atent, ambalată și gata de expediere din showroom-ul și depozitul nostru din Satu Mare.</p>' . "
" .
                           '<!-- /wp:paragraph -->' . "

" .
                           '<!-- wp:maxmobila/catalog /-->',
        ),
        'despre-noi' => array(
            'title'     => 'Despre noi & Cum funcționează outlet-ul',
            'slug'      => 'despre-noi',
            'template'  => 'templates/full-shop.php',
            'content'   => '<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px"}}} -->
' .
                           '<p style="font-size:16px">Află de unde provine mobila noastră nemțească, de ce prețurile sunt atât de mici și ce înseamnă fiecare dintre cele 4 stări ale produselor noastre.</p>
' .
                           '<!-- /wp:paragraph -->

' .
                           '<!-- wp:group {"style":{"spacing":{"padding":{"top":"24px","bottom":"24px","left":"24px","right":"24px"}},"border":{"radius":"12px"}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
' .
                           '<div class="wp-block-group has-white-background-color has-background" style="border-radius:12px;padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px">
' .
                           '<!-- wp:heading {"level":3} -->
' .
                           '<h3 class="wp-block-heading">De unde vine mobila</h3>
' .
                           '<!-- /wp:heading -->
' .
                           '<!-- wp:paragraph -->
' .
                           '<p>Cumpărăm direct din Germania surplus de stoc, colecții scoase din catalog, retururi și mobilier din expoziție. Marfa ajunge în depozitul nostru din Satu Mare, o verificăm bucată cu bucată, o fotografiem și o punem pe site cu starea ei reală.</p>
' .
                           '<!-- /wp:paragraph -->
' .
                           '</div>
' .
                           '<!-- /wp:group -->

' .
                           '<!-- wp:maxmobila/stari /-->

' .
                           '<!-- wp:group {"style":{"spacing":{"padding":{"top":"24px","bottom":"24px","left":"24px","right":"24px"}},"border":{"radius":"12px"}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
' .
                           '<div class="wp-block-group has-white-background-color has-background" style="border-radius:12px;padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px">
' .
                           '<!-- wp:heading {"level":3} -->
' .
                           '<h3 class="wp-block-heading">De ce este mai ieftin</h3>
' .
                           '<!-- /wp:heading -->
' .
                           '<!-- wp:paragraph -->
' .
                           '<p>Magazinele din Germania plătesc depozitare substanțială pentru fiecare zi în care un produs nu se vinde. Pentru ele este mai avantajos să elibereze rapid spațiul. Noi cumpărăm la preț de lot și vindem cu o reducere substanțială de până la 70% față de prețul nou din magazinele germane.</p>
' .
                           '<!-- /wp:paragraph -->
' .
                           '</div>
' .
                           '<!-- /wp:group -->

' .
                           '<!-- wp:maxmobila/showroom-banner /-->',
        ),
        'contact' => array(
            'title'     => 'Contact & Showroom',
            'slug'      => 'contact',
            'template'  => 'templates/full-shop.php',
            'content'   => '<!-- wp:heading {"level":2} -->
' .
                           '<h2 class="wp-block-heading">Showroom & Depozit Satu Mare</h2>
' .
                           '<!-- /wp:heading -->
' .
                           '<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px"}}} -->
' .
                           '<p style="font-size:16px">Vino să vezi și să testezi mobila direct în showroom-ul și depozitul nostru din Satu Mare înainte să cumperi. Te așteptăm cu drag!</p>
' .
                           '<!-- /wp:paragraph -->

' .
                           '<!-- wp:maxmobila/contact-form /-->',
        ),
        'cos' => array(
            'title'     => 'Coșul tău',
            'slug'      => 'cos',
            'template'  => 'templates/full-shop.php',
            'content'   => '<!-- wp:maxmobila/cos /-->',
        ),
        'finalizare' => array(
            'title'     => 'Finalizare Comandă',
            'slug'      => 'finalizare',
            'template'  => 'templates/full-shop.php',
            'content'   => '<!-- wp:maxmobila/checkout /-->',
        ),
    );

    $created = 0;
    foreach ( $pages_to_create as $key => $page_def ) {
        $existing = get_page_by_path( $page_def['slug'] );
        if ( ! $existing && ! empty( $page_def['title'] ) ) {
            $q = new WP_Query( array(
                'post_type'      => 'page',
                'title'          => $page_def['title'],
                'post_status'    => 'all',
                'posts_per_page' => 1,
            ) );
            if ( ! empty( $q->posts ) ) {
                $existing = $q->posts[0];
            }
        }

        if ( $existing ) {
            if ( $force_reset ) {
                wp_update_post( array(
                    'ID'           => $existing->ID,
                    'post_title'   => $page_def['title'],
                    'post_content' => $page_def['content'],
                    'post_status'  => 'publish',
                ) );
                update_post_meta( $existing->ID, '_wp_page_template', $page_def['template'] );
            }
            $target_id = $existing->ID;
        } else {
            $target_id = wp_insert_post( array(
                'post_title'     => $page_def['title'],
                'post_name'      => $page_def['slug'],
                'post_content'   => $page_def['content'],
                'post_status'    => 'publish',
                'post_type'      => 'page',
                'comment_status' => 'closed',
            ) );
            if ( $target_id && ! is_wp_error( $target_id ) ) {
                update_post_meta( $target_id, '_wp_page_template', $page_def['template'] );
                $created++;
            }
        }

        if ( ! empty( $page_def['is_front'] ) && $target_id ) {
            update_option( 'show_on_front', 'page' );
            update_option( 'page_on_front', $target_id );
        }
    }

    return $created;
}

// ----------------------------------------------------
// FRONT PAGE TAKEOVER & TEMPLATES
// ----------------------------------------------------
// Adaugă șablonul "MaxMobila Full Store" în lista de template-uri a temei
add_filter( 'theme_page_templates', function( $templates ) {
    $templates['templates/full-shop.php'] = 'MaxMobila — Magazin Complet';
    return $templates;
} );

// Încarcă șablonul dedicat dacă este selectat
add_filter( 'template_include', function( $template ) {
    // Dacă este o cerere pentru un produs individual (/produs/ID sau ?produs=ID)
    $prod_var = get_query_var( 'maxmobila_produs' );
    $req_path = strtok( $_SERVER['REQUEST_URI'] ?? '', '?' );
    $has_produs_path = preg_match( '#/produs/([a-zA-Z0-9_-]+)/?$#', $req_path );
    if ( ! empty( $prod_var ) || ! empty( $_GET['produs'] ) || $has_produs_path ) {
        $custom_tpl = MAXMOBILA_PATH . 'templates/full-shop.php';
        if ( file_exists( $custom_tpl ) ) {
            return $custom_tpl;
        }
    }

    if ( is_page_template( 'templates/full-shop.php' ) ) {
        $custom_tpl = MAXMOBILA_PATH . 'templates/full-shop.php';
        if ( file_exists( $custom_tpl ) ) {
            return $custom_tpl;
        }
    }

    if ( class_exists( 'WooCommerce' ) ) {
        if ( ( is_shop() && get_page_template_slug( wc_get_page_id('shop') ) === 'templates/full-shop.php' ) ||
             ( is_cart() && get_page_template_slug( wc_get_page_id('cart') ) === 'templates/full-shop.php' ) ||
             ( is_checkout() && get_page_template_slug( wc_get_page_id('checkout') ) === 'templates/full-shop.php' ) ) {
            $custom_tpl = MAXMOBILA_PATH . 'templates/full-shop.php';
            if ( file_exists( $custom_tpl ) ) {
                return $custom_tpl;
            }
        }
    }

    // Dacă este activă opțiunea de preluare automată a primei pagini
    $takeover = get_option( 'maxmobila_takeover_frontpage', '1' );
    if ( $takeover === '1' && ( is_front_page() || is_home() ) && ! is_admin() ) {
        $custom_tpl = MAXMOBILA_PATH . 'templates/full-shop.php';
        if ( file_exists( $custom_tpl ) ) {
            return $custom_tpl;
        }
    }

    return $template;
}, 99 );

// ----------------------------------------------------
// AJAX ORDER SUBMISSION
// ----------------------------------------------------
add_action( 'wp_ajax_maxmobila_submit_order', 'maxmobila_handle_submit_order' );
add_action( 'wp_ajax_nopriv_maxmobila_submit_order', 'maxmobila_handle_submit_order' );
function maxmobila_handle_submit_order() {
    $order_raw = isset( $_POST['order_json'] ) ? wp_unslash( $_POST['order_json'] ) : '';
    if ( empty( $order_raw ) ) {
        wp_send_json_error( array( 'message' => 'Lipsesc datele comenzii.' ) );
    }

    $order = json_decode( $order_raw, true );
    if ( ! $order ) {
        wp_send_json_error( array( 'message' => 'Format invalid.' ) );
    }

    // Salvează comanda în registrul MaxMobila
    $orders = get_option( 'maxmobila_received_orders', array() );
    $order['date'] = current_time( 'mysql' );
    $order_id = sanitize_text_field( $order['id'] ?? ( 'MX-' . time() ) );
    $orders[ $order_id ] = $order;
    update_option( 'maxmobila_received_orders', $orders );

    // Dacă WooCommerce este instalat, creează o comandă nativă WooCommerce
    $wc_order_id = 0;
    if ( class_exists( 'WooCommerce' ) && function_exists( 'wc_create_order' ) ) {
        try {
            $form = $order['form'] ?? array();
            $totals = $order['T'] ?? array();

            $address = array(
                'first_name' => sanitize_text_field( explode( ' ', $form['nume'] ?? '' )[0] ),
                'last_name'  => sanitize_text_field( substr( strstr( $form['nume'] ?? '', ' ' ), 1 ) ?: '-' ),
                'company'    => sanitize_text_field( $form['firma'] ?? '' ),
                'email'      => sanitize_email( $form['email'] ?? '' ),
                'phone'      => sanitize_text_field( $form['tel'] ?? '' ),
                'address_1'  => sanitize_text_field( $form['adr'] ?? '' ),
                'city'       => sanitize_text_field( $form['loc'] ?? '' ),
                'state'      => sanitize_text_field( $form['jud'] ?? '' ),
                'country'    => 'RO',
            );

            $wc_order = wc_create_order();
            $wc_order->set_address( $address, 'billing' );
            $wc_order->set_address( $address, 'shipping' );

            // Adaugă produsele
            if ( ! empty( $totals['L'] ) ) {
                foreach ( $totals['L'] as $line ) {
                    $item_name = sanitize_text_field( $line['p']['name'] ?? 'Produs MaxMobila' );
                    $price = floatval( $line['p']['priceRON'] ?? 0 );
                    $qty = intval( $line['q'] ?? 1 );

                    $item = new WC_Order_Item_Product();
                    $wc_prod_id = intval( $line['p']['wc_id'] ?? 0 );
                    if ( ! $wc_prod_id && ! empty( $line['p']['id'] ) && function_exists( 'wc_get_product_id_by_sku' ) ) {
                        $wc_prod_id = wc_get_product_id_by_sku( $line['p']['id'] );
                    }
                    if ( $wc_prod_id ) {
                        $item->set_product_id( $wc_prod_id );
                    }
                    $item->set_name( $item_name );
                    $item->set_quantity( $qty );
                    $item->set_subtotal( $price * $qty );
                    $item->set_total( $price * $qty );
                    $wc_order->add_item( $item );
                }
            }

            // Metodă de livrare
            $ship_name = sanitize_text_field( $totals['ship']['name'] ?? 'Curier' );
            $ship_cost = floatval( $totals['ship']['cost'] ?? 0 );
            $shipping_item = new WC_Order_Item_Shipping();
            $shipping_item->set_method_title( $ship_name );
            $shipping_item->set_total( $ship_cost );
            $wc_order->add_item( $shipping_item );

            // Servicii (montaj)
            if ( ! empty( $totals['svc'] ) ) {
                foreach ( $totals['svc'] as $s ) {
                    $fee = new WC_Order_Item_Fee();
                    $fee->set_name( sanitize_text_field( $s['name'] ) . ' x' . intval( $s['q'] ) );
                    $fee->set_total( floatval( $s['tot'] ) );
                    $wc_order->add_item( $fee );
                }
            }

            $wc_order->set_payment_method( sanitize_text_field( $order['pay']['id'] ?? 'cod' ) );
            $wc_order->set_payment_method_title( sanitize_text_field( $order['pay']['name'] ?? 'Ramburs la livrare' ) );
            if ( ! empty( $form['obs'] ) ) {
                $wc_order->set_customer_note( sanitize_textarea_field( $form['obs'] ) );
            }

            $wc_order->calculate_totals();
            $wc_order->update_status( 'processing', 'Comandă plasată prin interfața MaxMobila Outlet (' . $order_id . ')' );
            $wc_order_id = $wc_order->get_id();
        } catch ( Exception $e ) {
            error_log( 'MaxMobila WC Order Error: ' . $e->getMessage() );
        }
    }

    wp_send_json_success( array(
        'order_id'    => $order_id,
        'wc_order_id' => $wc_order_id,
    ) );
}

// ----------------------------------------------------
// AJAX CONTACT FORM SUBMISSION
// ----------------------------------------------------
add_action( 'wp_ajax_maxmobila_contact_submit', 'maxmobila_handle_contact_submit' );
add_action( 'wp_ajax_nopriv_maxmobila_contact_submit', 'maxmobila_handle_contact_submit' );
function maxmobila_handle_contact_submit() {
    $nume    = sanitize_text_field( $_POST['nume'] ?? '' );
    $tel     = sanitize_text_field( $_POST['tel'] ?? '' );
    $subiect = sanitize_text_field( $_POST['subiect'] ?? '' );
    $mesaj   = sanitize_textarea_field( $_POST['mesaj'] ?? '' );

    if ( empty( $nume ) || empty( $tel ) ) {
        wp_send_json_error( array( 'message' => 'Numele și telefonul sunt obligatorii.' ) );
    }

    $inquiries = get_option( 'maxmobila_contact_inquiries', array() );
    $inquiries[] = array(
        'id'      => uniqid( 'msg_' ),
        'date'    => current_time( 'mysql' ),
        'nume'    => $nume,
        'tel'     => $tel,
        'subiect' => $subiect,
        'mesaj'   => $mesaj,
    );
    update_option( 'maxmobila_contact_inquiries', $inquiries );

    wp_send_json_success( array( 'message' => 'Mesaj înregistrat.' ) );
}

// ----------------------------------------------------
// AJAX SHOWROOM RESERVATIONS (REZERVĂRI RAPIDE ÎN MAGAZIN)
// ----------------------------------------------------
add_action( 'wp_ajax_maxmobila_submit_reservation', 'maxmobila_handle_submit_reservation' );
add_action( 'wp_ajax_nopriv_maxmobila_submit_reservation', 'maxmobila_handle_submit_reservation' );
function maxmobila_handle_submit_reservation() {
    $res_raw = isset( $_POST['res_json'] ) ? wp_unslash( $_POST['res_json'] ) : '';
    if ( empty( $res_raw ) ) {
        wp_send_json_error( array( 'message' => 'Lipsesc datele rezervării.' ) );
    }

    $res = json_decode( $res_raw, true );
    if ( ! $res || empty( $res['nume'] ) || empty( $res['tel'] ) ) {
        wp_send_json_error( array( 'message' => 'Completează numele și numărul de telefon.' ) );
    }

    $all_reservations = get_option( 'maxmobila_showroom_reservations', array() );
    $res['created_at'] = current_time( 'mysql' );
    $res_id = sanitize_text_field( $res['id'] ?? ( 'REZ-' . time() ) );
    $all_reservations[ $res_id ] = $res;
    update_option( 'maxmobila_showroom_reservations', $all_reservations );

    wp_send_json_success( array(
        'message' => 'Rezervarea a fost înregistrată cu succes!',
        'id'      => $res_id,
    ) );
}

// ----------------------------------------------------
// ADMIN MENU & DASHBOARD
// ----------------------------------------------------
add_action( 'admin_menu', 'maxmobila_register_admin_menu' );
function maxmobila_register_admin_menu() {
    add_menu_page(
        'MaxMobila',
        'MaxMobila Outlet',
        'manage_options',
        'maxmobila-dashboard',
        'maxmobila_render_admin_dashboard',
        'dashicons-store',
        30
    );

    add_submenu_page(
        'maxmobila-dashboard',
        'Comenzi MaxMobila',
        'Comenzi',
        'manage_options',
        'maxmobila-orders',
        'maxmobila_render_admin_orders'
    );

    add_submenu_page(
        'maxmobila-dashboard',
        'Rezervări Showroom',
        'Rezervări Showroom',
        'manage_options',
        'maxmobila-reservations',
        'maxmobila_render_admin_reservations'
    );

    add_submenu_page(
        'maxmobila-dashboard',
        'Mesaje Showroom',
        'Mesaje Showroom',
        'manage_options',
        'maxmobila-inquiries',
        'maxmobila_render_admin_inquiries'
    );

    add_submenu_page(
        'maxmobila-dashboard',
        'Marje & Profit Intern',
        'Marje & Profit Intern',
        'manage_options',
        'maxmobila-margins',
        'maxmobila_render_admin_margins'
    );

    add_submenu_page(
        'maxmobila-dashboard',
        'Sincronizare WooCommerce',
        'Sincronizare WooCommerce',
        'manage_options',
        'maxmobila-sync',
        'maxmobila_render_admin_sync'
    );

    add_submenu_page(
        'maxmobila-dashboard',
        'Setări MaxMobila',
        'Setări',
        'manage_options',
        'maxmobila-settings',
        'maxmobila_render_admin_settings'
    );
}

// Submenu: Panou de control
function maxmobila_render_admin_dashboard() {
    $defaults = maxmobila_get_default_data();
    $orders   = get_option( 'maxmobila_received_orders', array() );
    $inquiries = get_option( 'maxmobila_contact_inquiries', array() );
    $store_name = get_option( 'maxmobila_store_name', 'MaxMobila' );
    ?>
    <div class="wrap">
        <div style="display:flex;align-items:center;gap:18px;margin:20px 0 16px;flex-wrap:wrap;">
            <img src="<?php echo esc_url( MAXMOBILA_ASSETS_URL . 'images/logo-maxmobila.png' ); ?>" alt="<?php echo esc_attr( $store_name ); ?>" style="height:44px;width:auto;display:block;">
            <h1 style="margin:0;line-height:1.2;">Panou de Control — <?php echo esc_html( $store_name ); ?> Outlet</h1>
        </div>
        <div style="display:flex;gap:20px;margin-top:20px;">
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ccd0d4;flex:1;">
                <h3 style="margin-top:0">Total Produse în Catalog</h3>
                <p style="font-size:32px;font-weight:bold;margin:10px 0;color:#0073aa"><?php echo count( $defaults['products'] ); ?></p>
                <p><a href="<?php echo admin_url('admin.php?page=maxmobila-sync'); ?>">Sincronizează cu WooCommerce &rarr;</a></p>
            </div>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ccd0d4;flex:1;">
                <h3 style="margin-top:0">Comenzi Înregistrate</h3>
                <p style="font-size:32px;font-weight:bold;margin:10px 0;color:#46b450"><?php echo count( $orders ); ?></p>
                <p><a href="<?php echo admin_url('admin.php?page=maxmobila-orders'); ?>">Vezi comenzile &rarr;</a></p>
            </div>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ccd0d4;flex:1;">
                <h3 style="margin-top:0">Mesaje / Programări Showroom</h3>
                <p style="font-size:32px;font-weight:bold;margin:10px 0;color:#f56e28"><?php echo count( $inquiries ); ?></p>
                <p><a href="<?php echo admin_url('admin.php?page=maxmobila-inquiries'); ?>">Vezi mesajele &rarr;</a></p>
            </div>
        </div>

        <div style="margin-top:30px;background:#fff;padding:20px;border-radius:8px;border:1px solid #ccd0d4;">
            <h3>Editor Vizual Gutenberg & Șablon Magazin</h3>
            <p>Paginile site-ului pot fi editate vizual direct din <strong><a href="<?php echo admin_url('edit.php?post_type=page'); ?>">Pagini</a></strong>. În editorul WordPress vei vedea direct template-ul magazinului cu fonturile originale, culorile, imaginile reale și textele pe care le poți modifica cu un singur click.</p>
            <p>Blocurile vizuale disponibile în editor la categoria <strong>MaxMobila Outlet</strong>:</p>
            <ul>
                <li><strong>Hero Banner</strong> — Previzualizare completă cu colaj 3 piese, titlu și introducere editabile direct pe ecran</li>
                <li><strong>Categorii</strong> — Grila cu poze reale din fiecare categorie</li>
                <li><strong>Top Reduceri</strong> — Cardurile celor mai mari reduceri cu poze și prețuri</li>
                <li><strong>Stări Mobilier</strong> — Cardurile celor 4 stări (Nou, Resigilat, Expus, Mici defecte)</li>
                <li><strong>Banner Showroom</strong> — Bannerul auriu cu număr de telefon și buton programare</li>
                <li><strong>Întrebări Frecvente (FAQ)</strong> — Acordeon cu întrebări și răspunsuri</li>
                <li><strong>Catalog cu Filtre</strong> — Previzualizare catalog cu filtre de buget și sortare</li>
                <li><strong>Formular Contact & Showroom</strong> — Formularul de programare și caseta showroom</li>
            </ul>
        </div>
    </div>
    <?php
}

// Submenu: Comenzi
function maxmobila_render_admin_orders() {
    $orders = get_option( 'maxmobila_received_orders', array() );
    ?>
    <div class="wrap">
        <h1>Comenzi MaxMobila</h1>
        <?php if ( empty( $orders ) ) : ?>
            <p>Nu există încă comenzi înregistrate.</p>
        <?php else : ?>
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th>ID Comandă</th>
                        <th>Data</th>
                        <th>Client</th>
                        <th>Telefon</th>
                        <th>Localitate</th>
                        <th>Total</th>
                        <th>Metodă Plată</th>
                        <th>Produse</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ( array_reverse( $orders ) as $o ) : 
                        $f = $o['form'] ?? array();
                        $t = $o['T'] ?? array();
                    ?>
                        <tr>
                            <td><strong><?php echo esc_html( $o['id'] ?? '-' ); ?></strong></td>
                            <td><?php echo esc_html( $o['date'] ?? '-' ); ?></td>
                            <td><?php echo esc_html( $f['nume'] ?? '-' ); ?><br><small><?php echo esc_html( $f['email'] ?? '' ); ?></small></td>
                            <td><a href="tel:<?php echo esc_attr( $f['tel'] ?? '' ); ?>"><?php echo esc_html( $f['tel'] ?? '-' ); ?></a></td>
                            <td><?php echo esc_html( ( $f['loc'] ?? '' ) . ', ' . ( $f['jud'] ?? '' ) ); ?></td>
                            <td><strong><?php echo maxmobila_format_lei( $t['total'] ?? 0 ); ?></strong></td>
                            <td><?php echo esc_html( $o['pay']['name'] ?? 'Ramburs' ); ?></td>
                            <td>
                                <?php 
                                if ( ! empty( $t['L'] ) ) {
                                    foreach ( $t['L'] as $item ) {
                                        echo esc_html( ( $item['p']['name'] ?? 'Produs' ) . ' x' . ( $item['q'] ?? 1 ) ) . '<br>';
                                    }
                                }
                                ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
    <?php
}

// Submenu: Rezervări Showroom (Clienți care vin la depozit)
function maxmobila_render_admin_reservations() {
    $reservations = get_option( 'maxmobila_showroom_reservations', array() );
    ?>
    <div class="wrap">
        <h1>Rezervări Piese în Showroom & Depozit</h1>
        <p>Clienți care au rezervat o piesă pe site și vin să o vadă / achite la depozitul din Satu Mare.</p>
        <?php if ( empty( $reservations ) ) : ?>
            <p>Nu există încă rezervări de showroom înregistrate.</p>
        <?php else : ?>
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th>Cod Rezervare</th>
                        <th>Data</th>
                        <th>Client</th>
                        <th>Telefon</th>
                        <th>Produs Rezervat</th>
                        <th>Preț</th>
                        <th>Când vine la depozit</th>
                        <th>Observații</th>
                        <th>Acțiuni Rapide</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ( array_reverse( $reservations ) as $r ) : 
                        $tel_clean = preg_replace( '/\D/', '', $r['tel'] ?? '' );
                        $wa_msg = urlencode( 'Bună ziua, ' . ( $r['nume'] ?? 'client' ) . '! Vă contactăm de la MaxMobila Satu Mare privind rezervarea piesei ' . ( $r['prodName'] ?? '' ) . ' (Cod ' . ( $r['id'] ?? '' ) . '). Vă așteptăm cu drag la showroom!' );
                    ?>
                        <tr>
                            <td><strong><?php echo esc_html( $r['id'] ?? '' ); ?></strong></td>
                            <td><?php echo esc_html( $r['created_at'] ?? '' ); ?></td>
                            <td><strong><?php echo esc_html( $r['nume'] ?? '' ); ?></strong></td>
                            <td><a href="tel:<?php echo esc_attr( $r['tel'] ?? '' ); ?>" class="button button-small">📞 <?php echo esc_html( $r['tel'] ?? '' ); ?></a></td>
                            <td><strong><?php echo esc_html( $r['prodName'] ?? '' ); ?></strong></td>
                            <td><strong style="color:#d7262e;"><?php echo esc_html( number_format( (float)($r['priceRON'] ?? 0), 0, ',', '.' ) ); ?> lei</strong></td>
                            <td><span style="background:#e3f1e8;color:#2f7d4f;padding:3px 8px;border-radius:4px;font-weight:bold;"><?php echo esc_html( $r['cand'] ?? 'Curând' ); ?></span></td>
                            <td><?php echo esc_html( $r['obs'] ?? '—' ); ?></td>
                            <td>
                                <a href="https://wa.me/<?php echo esc_attr( $tel_clean ); ?>?text=<?php echo $wa_msg; ?>" target="_blank" class="button button-small" style="background:#25D366;color:#fff;border-color:#20ba5c;">💬 WhatsApp</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
    <?php
}

// Submenu: Mesaje Showroom
function maxmobila_render_admin_inquiries() {
    $inquiries = get_option( 'maxmobila_contact_inquiries', array() );
    ?>
    <div class="wrap">
        <h1>Mesaje & Programări Showroom</h1>
        <?php if ( empty( $inquiries ) ) : ?>
            <p>Nu există încă mesaje primite prin formularul de contact.</p>
        <?php else : ?>
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Nume</th>
                        <th>Telefon</th>
                        <th>Subiect</th>
                        <th>Mesaj</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ( array_reverse( $inquiries ) as $inq ) : ?>
                        <tr>
                            <td><?php echo esc_html( $inq['date'] ); ?></td>
                            <td><strong><?php echo esc_html( $inq['nume'] ); ?></strong></td>
                            <td><a href="tel:<?php echo esc_attr( $inq['tel'] ); ?>"><?php echo esc_html( $inq['tel'] ); ?></a></td>
                            <td><?php echo esc_html( $inq['subiect'] ); ?></td>
                            <td><?php echo nl2br( esc_html( $inq['mesaj'] ) ); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
    <?php
}

// Submenu: Marje & Profit Intern
function maxmobila_render_admin_margins() {
    $defaults = maxmobila_get_active_data();
    $calc     = $defaults['calc'];
    $products = $defaults['products'];

    $total_invest = 0;
    $total_sale   = 0;
    $total_new    = 0;

    foreach ( $products as $p ) {
        $cost_ron = ( $p['buyEUR'] + $calc['transportEUR'] ) * $calc['fx'];
        $cost_total = $cost_ron * ( 1 + $calc['lossPct'] );
        $total_invest += $cost_total * $p['stock'];
        $total_sale   += $p['priceRON'] * $p['stock'];
        $total_new    += $p['newRON'] * $p['stock'];
    }

    $profit_total = $total_sale - $total_invest;
    $marja_globala = $total_sale > 0 ? round( ( $profit_total / $total_sale ) * 100, 1 ) : 0;
    ?>
    <div class="wrap">
        <h1>Raport Intern: Marje, Costuri de Achiziție & Profitabilitate</h1>
        <p>Acest modul a fost mutat complet în panoul securizat WordPress (accesibil doar administratorilor).</p>

        <div style="display:flex;gap:20px;margin:20px 0;">
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ccd0d4;flex:1;">
                <div style="color:#666;font-size:13px;">Valoare Achiziție Totală (Stoc)</div>
                <div style="font-size:24px;font-weight:bold;margin-top:6px;"><?php echo maxmobila_format_lei( $total_invest ); ?></div>
            </div>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ccd0d4;flex:1;">
                <div style="color:#666;font-size:13px;">Venit Estimat Vânzare Stoc</div>
                <div style="font-size:24px;font-weight:bold;margin-top:6px;color:#0073aa;"><?php echo maxmobila_format_lei( $total_sale ); ?></div>
            </div>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ccd0d4;flex:1;">
                <div style="color:#666;font-size:13px;">Profit Brut Estimat</div>
                <div style="font-size:24px;font-weight:bold;margin-top:6px;color:#46b450;"><?php echo maxmobila_format_lei( $profit_total ); ?></div>
            </div>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ccd0d4;flex:1;">
                <div style="color:#666;font-size:13px;">Marjă Comercială Globală</div>
                <div style="font-size:24px;font-weight:bold;margin-top:6px;color:#d54e21;"><?php echo $marja_globala; ?>%</div>
            </div>
        </div>

        <table class="widefat striped">
            <thead>
                <tr>
                    <th>Produs</th>
                    <th>Stare</th>
                    <th>Achiziție (EUR)</th>
                    <th>Cost Total (RON)</th>
                    <th>Preț Nou Germania</th>
                    <th>Preț Outlet MaxMobila</th>
                    <th>Profit/Buc</th>
                    <th>Marjă</th>
                    <th>Stoc</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ( $products as $p ) : 
                    $cost_ron = ( $p['buyEUR'] + $calc['transportEUR'] ) * $calc['fx'];
                    $cost_total = $cost_ron * ( 1 + $calc['lossPct'] );
                    $profit = $p['priceRON'] - $cost_total;
                    $marja = $p['priceRON'] > 0 ? round( ( $profit / $p['priceRON'] ) * 100 ) : 0;
                ?>
                    <tr>
                        <td><strong><?php echo esc_html( $p['name'] ); ?></strong><br><small><?php echo esc_html( $p['id'] ); ?></small></td>
                        <td><?php echo maxmobila_get_st_badge( $p ); ?></td>
                        <td><?php echo esc_html( $p['buyEUR'] ); ?> €</td>
                        <td><?php echo maxmobila_format_lei( $cost_total ); ?></td>
                        <td><s><?php echo maxmobila_format_lei( $p['newRON'] ); ?></s></td>
                        <td><strong><?php echo maxmobila_format_lei( $p['priceRON'] ); ?></strong></td>
                        <td style="color:<?php echo $profit > 0 ? '#46b450' : '#dc3232'; ?>"><strong><?php echo maxmobila_format_lei( $profit ); ?></strong></td>
                        <td><strong><?php echo $marja; ?>%</strong></td>
                        <td><?php echo esc_html( $p['stock'] ); ?> buc</td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

// Submenu: Sincronizare WooCommerce
function maxmobila_render_admin_sync() {
    $wc_active = class_exists( 'WooCommerce' );
    $sync_result = '';

    if ( $wc_active && isset( $_POST['maxmobila_sync_wc'] ) && check_admin_referer( 'maxmobila_sync_action', 'maxmobila_sync_nonce' ) ) {
        $count = maxmobila_sync_products_to_woocommerce();
        $sync_result = '<div class="notice notice-success is-dismissible"><p>Sincronizare completă! <strong>' . intval( $count ) . '</strong> produse au fost create/actualizate în WooCommerce.</p></div>';
    }
    ?>
    <div class="wrap">
        <h1>Sincronizare cu WooCommerce</h1>
        <?php echo $sync_result; ?>

        <?php if ( ! $wc_active ) : ?>
            <div class="notice notice-warning">
                <p>WooCommerce nu este activat. Pluginul funcționează complet autonom, folosind catalogul de produse integrat și sistemul propriu de comenzi.</p>
            </div>
        <?php else : ?>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ccd0d4;max-width:800px;margin-top:20px;">
                <h3>Importă cele 49 de produse MaxMobila în catalogul WooCommerce</h3>
                <p>Apasă butonul de mai jos pentru a genera produsele native WooCommerce, categoriile și atributele (stare, material, culoare, dimensiuni).</p>
                <form method="post" action="">
                    <?php wp_nonce_field( 'maxmobila_sync_action', 'maxmobila_sync_nonce' ); ?>
                    <input type="submit" name="maxmobila_sync_wc" class="button button-primary button-large" value="Sincronizează produsele în WooCommerce acum">
                </form>
            </div>
        <?php endif; ?>
    </div>
    <?php
}

function maxmobila_ensure_product_attachment( $img_key, $prod_name = '' ) {
    if ( empty( $img_key ) ) {
        return 0;
    }

    $map = get_option( 'maxmobila_asset_attachments', array() );
    if ( ! is_array( $map ) ) {
        $map = array();
    }

    if ( ! empty( $map[ $img_key ] ) ) {
        $aid = intval( $map[ $img_key ] );
        $post = get_post( $aid );
        $file = get_attached_file( $aid );
        if ( $post && $post->post_type === 'attachment' && $file && file_exists( $file ) ) {
            return $aid;
        }
    }

    $src = MAXMOBILA_PATH . 'assets/images/' . $img_key . '.webp';
    if ( ! file_exists( $src ) ) {
        return 0;
    }

    $upload = wp_upload_dir();
    if ( ! empty( $upload['error'] ) ) {
        return 0;
    }

    $dest_dir = trailingslashit( $upload['basedir'] ) . 'maxmobila';
    $dest_url = trailingslashit( $upload['baseurl'] ) . 'maxmobila';
    if ( ! file_exists( $dest_dir ) ) {
        wp_mkdir_p( $dest_dir );
    }

    $filename = 'maxmobila-' . sanitize_file_name( $img_key ) . '.webp';
    $dest     = trailingslashit( $dest_dir ) . $filename;
    if ( ! file_exists( $dest ) ) {
        if ( ! @copy( $src, $dest ) ) {
            return 0;
        }
    }

    $attachment = array(
        'guid'           => trailingslashit( $dest_url ) . $filename,
        'post_mime_type' => 'image/webp',
        'post_title'     => $prod_name ? sanitize_text_field( $prod_name ) : sanitize_text_field( $img_key ),
        'post_content'   => '',
        'post_status'    => 'inherit',
    );

    $attach_id = wp_insert_attachment( $attachment, $dest );
    if ( ! $attach_id || is_wp_error( $attach_id ) ) {
        return 0;
    }

    if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
        require_once ABSPATH . 'wp-admin/includes/image.php';
    }
    $attach_data = wp_generate_attachment_metadata( $attach_id, $dest );
    if ( is_array( $attach_data ) ) {
        wp_update_attachment_metadata( $attach_id, $attach_data );
    }

    $map[ $img_key ] = $attach_id;
    update_option( 'maxmobila_asset_attachments', $map );

    return $attach_id;
}

function maxmobila_sync_products_to_woocommerce() {
    if ( ! class_exists( 'WooCommerce' ) ) return 0;

    $data = maxmobila_get_default_data();
    $categories = $data['categories'];
    $products   = $data['products'];

    $cat_ids = array();
    foreach ( $categories as $c ) {
        $term = get_term_by( 'slug', $c['id'], 'product_cat' );
        if ( ! $term ) {
            $inserted = wp_insert_term( $c['name'], 'product_cat', array( 'slug' => $c['id'] ) );
            if ( ! is_wp_error( $inserted ) && isset( $inserted['term_id'] ) ) {
                $cat_ids[ $c['id'] ] = intval( $inserted['term_id'] );
            }
        } elseif ( ! is_wp_error( $term ) ) {
            $cat_ids[ $c['id'] ] = intval( $term->term_id );
        }
    }

    $state_labels = array(
        'nou'       => 'Nou',
        'resigilat' => 'Resigilat',
        'expus'     => 'Expus',
        'defecte'   => 'Mici defecte',
    );

    $count = 0;
    foreach ( $products as $idx => $p ) {
        $existing = wc_get_product_id_by_sku( $p['id'] );
        if ( $existing ) {
            $product = wc_get_product( $existing );
        } else {
            $product = new WC_Product_Simple();
            $product->set_sku( $p['id'] );
        }
        if ( ! $product ) {
            continue;
        }

        $product->set_name( $p['name'] );
        $product->set_regular_price( $p['newRON'] );
        $product->set_price( $p['priceRON'] );
        $product->set_sale_price( $p['priceRON'] );
        $product->set_manage_stock( true );
        $product->set_stock_quantity( $p['stock'] );
        $product->set_stock_status( intval( $p['stock'] ) > 0 ? 'instock' : 'outofstock' );

        if ( isset( $cat_ids[ $p['cat'] ] ) ) {
            $product->set_category_ids( array( $cat_ids[ $p['cat'] ] ) );
        }

        if ( ! $product->get_image_id() && ! empty( $p['img'] ) ) {
            $attach_id = maxmobila_ensure_product_attachment( $p['img'], $p['name'] );
            if ( $attach_id ) {
                $product->set_image_id( $attach_id );
            }
        }

        $attributes = array();
        
        $attr_stare = new WC_Product_Attribute();
        $attr_stare->set_name( 'Stare' );
        $st_label = $state_labels[ $p['state'] ] ?? ucfirst( $p['state'] );
        $attr_stare->set_options( array( $st_label ) );
        $attr_stare->set_visible( true );
        $attributes[] = $attr_stare;

        if ( ! empty( $p['material'] ) ) {
            $attr_mat = new WC_Product_Attribute();
            $attr_mat->set_name( 'Material' );
            $attr_mat->set_options( array( ucfirst( $p['material'] ) ) );
            $attr_mat->set_visible( true );
            $attributes[] = $attr_mat;
        }

        if ( ! empty( $p['color'] ) ) {
            $attr_col = new WC_Product_Attribute();
            $attr_col->set_name( 'Culoare' );
            $attr_col->set_options( array( ucfirst( $p['color'] ) ) );
            $attr_col->set_visible( true );
            $attributes[] = $attr_col;
        }

        if ( ! empty( $p['dims'] ) ) {
            $attr_dims = new WC_Product_Attribute();
            $attr_dims->set_name( 'Dimensiuni' );
            $attr_dims->set_options( array( $p['dims'] ) );
            $attr_dims->set_visible( true );
            $attributes[] = $attr_dims;
        }

        $product->set_attributes( $attributes );
        $product->save();

        $pid = $product->get_id();
        if ( ! empty( $p['img'] ) ) {
            update_post_meta( $pid, '_maxmobila_img', sanitize_text_field( $p['img'] ) );
        }
        if ( isset( $p['buyEUR'] ) ) {
            update_post_meta( $pid, '_maxmobila_buy_eur', floatval( $p['buyEUR'] ) );
        }
        update_post_meta( $pid, '_maxmobila_sort_order', intval( $idx ) );

        if ( ! empty( $p['defect'] ) ) {
            update_post_meta( $pid, '_maxmobila_defect', sanitize_text_field( $p['defect'] ) );
        }

        $count++;
    }

    update_option( 'maxmobila_wc_sync_fixed_v2', '1' );

    return $count;
}

// Submenu: Setări
function maxmobila_render_admin_settings() {
    if ( isset( $_POST['maxmobila_save_settings'] ) && check_admin_referer( 'maxmobila_settings_save', 'maxmobila_nonce_field' ) ) {
        update_option( 'maxmobila_store_name', sanitize_text_field( $_POST['store_name'] ?? 'MaxMobila' ) );
        update_option( 'maxmobila_tagline', sanitize_text_field( $_POST['tagline'] ?? '' ) );
        update_option( 'maxmobila_phone', sanitize_text_field( $_POST['phone'] ?? '' ) );
        update_option( 'maxmobila_phone_raw', sanitize_text_field( $_POST['phone_raw'] ?? '' ) );
        update_option( 'maxmobila_email', sanitize_email( $_POST['email'] ?? '' ) );
        update_option( 'maxmobila_city', sanitize_text_field( $_POST['city'] ?? '' ) );
        update_option( 'maxmobila_address', sanitize_text_field( $_POST['address'] ?? '' ) );
        update_option( 'maxmobila_free_ship', intval( $_POST['free_ship'] ?? 2500 ) );
        update_option( 'maxmobila_warranty', intval( $_POST['warranty'] ?? 2 ) );
        update_option( 'maxmobila_takeover_frontpage', isset( $_POST['takeover_frontpage'] ) ? '1' : '0' );

        echo '<div class="notice notice-success is-dismissible"><p>Setările au fost salvate cu succes!</p></div>';
    }

    if ( isset( $_POST['maxmobila_generate_pages'] ) && check_admin_referer( 'maxmobila_gen_pages_action', 'maxmobila_gen_pages_nonce' ) ) {
        $count = maxmobila_create_default_pages( true );
        echo '<div class="notice notice-success is-dismissible"><p><strong>Paginile WordPress au fost configurate cu succes cu blocurile vizuale!</strong> Deschide <a href="' . esc_url( admin_url( 'edit.php?post_type=page' ) ) . '">Meniul Pagini</a> pentru a le edita direct pe ecran.</p></div>';
    }

    $store_name = get_option( 'maxmobila_store_name', 'MaxMobila' );
    $tagline    = get_option( 'maxmobila_tagline', 'Outlet · mobilă din Germania' );
    $phone      = get_option( 'maxmobila_phone', '+40 700 000 000' );
    $phone_raw  = get_option( 'maxmobila_phone_raw', '+40700000000' );
    $email      = get_option( 'maxmobila_email', 'contact@maxmobila.ro' );
    $city       = get_option( 'maxmobila_city', 'Satu Mare' );
    $address    = get_option( 'maxmobila_address', 'Showroom & depozit, Satu Mare' );
    $free_ship  = get_option( 'maxmobila_free_ship', 2500 );
    $warranty   = get_option( 'maxmobila_warranty', 2 );
    $takeover   = get_option( 'maxmobila_takeover_frontpage', '1' );
    ?>
    <div class="wrap" style="max-width:960px">
        <h1>Setări Magazin MaxMobila</h1>

        <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ccd0d4;margin:20px 0;">
            <h2 style="margin-top:0">Configurare Pagini Editabile cu Interfață Vizuală</h2>
            <p>Apasă butonul de mai jos pentru a configura automat paginile WordPress (Acasă, Magazin, Despre noi, Contact etc.) folosind <strong>blocurile vizuale Gutenberg</strong>. În editorul paginii vei vedea direct template-ul complet al magazinului și vei putea modifica textele cu un simplu click pe ecran.</p>
            <form method="post" action="" style="margin-bottom:15px;">
                <?php wp_nonce_field( 'maxmobila_gen_pages_action', 'maxmobila_gen_pages_nonce' ); ?>
                <input type="submit" name="maxmobila_generate_pages" class="button button-primary button-large" value="Configurează Paginile cu Interfață Vizuală Gutenberg" onclick="return confirm('Doriți să configurați paginile MaxMobila cu șablonul vizual complet?');">
            </form>
            <p class="description">Fiecare secțiune (Hero, Categorii, Reduceri, Stări, Showroom, FAQ) devine un bloc vizual în editor.</p>
        </div>

        <form method="post" action="">
            <?php wp_nonce_field( 'maxmobila_settings_save', 'maxmobila_nonce_field' ); ?>
            <h2>Date Magazin</h2>
            <table class="form-table">
                <tr>
                    <th><label for="store_name">Nume Magazin / Brand</label></th>
                    <td>
                        <input name="store_name" id="store_name" type="text" value="<?php echo esc_attr( $store_name ); ?>" class="regular-text">
                        <p class="description">Poți folosi <code>MaxMobila</code> sau <code>Mobexa</code>.</p>
                    </td>
                </tr>
                <tr>
                    <th><label for="tagline">Slogan</label></th>
                    <td><input name="tagline" id="tagline" type="text" value="<?php echo esc_attr( $tagline ); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="phone">Telefon afișat</label></th>
                    <td><input name="phone" id="phone" type="text" value="<?php echo esc_attr( $phone ); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="phone_raw">Telefon link (tel:)</label></th>
                    <td><input name="phone_raw" id="phone_raw" type="text" value="<?php echo esc_attr( $phone_raw ); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="email">Email contact</label></th>
                    <td><input name="email" id="email" type="email" value="<?php echo esc_attr( $email ); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="city">Oraș showroom / depozit</label></th>
                    <td><input name="city" id="city" type="text" value="<?php echo esc_attr( $city ); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="address">Adresă completă</label></th>
                    <td><input name="address" id="address" type="text" value="<?php echo esc_attr( $address ); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="free_ship">Prag livrare gratuită (lei)</label></th>
                    <td><input name="free_ship" id="free_ship" type="number" value="<?php echo esc_attr( $free_ship ); ?>" class="small-text"> lei</td>
                </tr>
                <tr>
                    <th><label for="warranty">Ani garanție</label></th>
                    <td><input name="warranty" id="warranty" type="number" value="<?php echo esc_attr( $warranty ); ?>" class="small-text"> ani</td>
                </tr>
                <tr>
                    <th>Afișare pe prima pagină</th>
                    <td>
                        <label>
                            <input name="takeover_frontpage" type="checkbox" value="1" <?php checked( $takeover, '1' ); ?>>
                            Afișează șablonul MaxMobila pe prima pagină a site-ului
                        </label>
                    </td>
                </tr>
            </table>
            <p class="submit">
                <input type="submit" name="maxmobila_save_settings" id="submit" class="button button-primary" value="Salvează setările">
            </p>
        </form>
    </div>
    <?php
}
