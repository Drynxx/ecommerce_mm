<?php
/**
 * MaxMobila Standalone Full Shop Template
 * Template Name: MaxMobila — Magazin Complet
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
$store_name = get_option('maxmobila_store_name', 'MaxMobila');
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title><?php wp_title( '—', true, 'right' ); ?> <?php echo esc_html( $store_name ); ?> — Outlet mobilă din Germania</title>
<link rel="icon" href="<?php echo esc_url( plugins_url('assets/favicon.png', dirname(__FILE__)) ); ?>">
<?php wp_head(); ?>
</head>
<body <?php body_class('maxmobila-standalone-app'); ?>>
<?php if ( function_exists('wp_body_open') ) { wp_body_open(); } ?>

<div class="promo"><div class="wrap" id="promo"></div></div>
<header class="hdr">
  <div class="wrap row" id="hdr">
    <a class="logo" href="#/acasa" aria-label="MaxMobila, acasă">
      <img src="<?php echo esc_url( plugins_url('assets/images/logo-maxmobila.png', dirname(__FILE__)) ); ?>" alt="MaxMobila Outlet" class="logo-img" width="220" height="54" loading="eager">
    </a>
  </div>
  <nav class="cats"><div class="wrap" id="cats"></div></nav>
</header>

<main id="view" data-has-server-content="<?php echo ( have_posts() || ( function_exists('is_shop') && is_shop() ) ) ? '1' : '0'; ?>">
<?php
if ( function_exists('is_shop') && is_shop() ) {
    $shop_id = wc_get_page_id('shop');
    $shop_post = get_post( $shop_id );
    if ( $shop_post ) {
        echo apply_filters( 'the_content', $shop_post->post_content );
    }
} elseif ( have_posts() ) {
    while ( have_posts() ) {
        the_post();
        the_content();
    }
}
?>
</main>

<footer id="ftr">
  <div class="wrap"><div class="cols">
    <div>
      <a class="logo" href="#/acasa" aria-label="MaxMobila, acasă">
        <img src="<?php echo esc_url( plugins_url('assets/images/logo-maxmobila-white.png', dirname(__FILE__)) ); ?>" alt="MaxMobila Outlet" class="logo-img" width="220" height="54" loading="lazy">
      </a>
      <p style="font-size:14px;max-width:320px;margin-top:14px">Mobilă adusă direct din Germania: surplus de stoc, colecții trecute, retururi și expoziție. Showroom și depozit în Satu Mare.</p>
    </div>
  </div></div>
</footer>
<div class="toast" id="toast" role="status"></div>

<?php wp_footer(); ?>
</body>
</html>
