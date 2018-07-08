<?php
/**
 * The sidebar containing the main home columns widget areas
 *
 */
?>

<div id="top-widget">

	<?php if ( is_active_sidebar( 'homepage-top-widget-area' ) ) : ?>

			<div id="top-widget-inner">

				<?php if ( !dynamic_sidebar( 'homepage-top-widget-area' ) && current_user_can('edit_theme_options') ) : ?>

						<h2 class="sidebar-title">
							<?php esc_html_e('Homepage Above Columns', 'ayabooks'); ?>
						</h2><!-- .sidebar-title -->
								
						<div class="sidebar-after-title">
						</div><!-- .sidebar-after-title -->
								
						<div class="textwidget">
							<?php esc_html_e('This is homepage above columns widget area. To customize it, please navigate to Admin Panel -> Appearance -> Widgets and add widgets to Homepage Above Columns.', 'ayabooks'); ?>
						</div><!-- .textwidget -->

				<?php endif; // end of ! dynamic_sidebar( 'homepage-top-widget-area' )
						  ?>

				<div class="clear">
				</div>

			</div>

	<?php endif; ?>

</div>

<div id="home-cols">

	<div id="home-cols-inner">

		<?php if ( is_active_sidebar( 'homepage-column-1-widget-area' ) ) : ?>

				<?php 
					/**
					 * Display widgets dragged in 'Homepage Columns 1' widget areas
					 */
				?>
				<div class="col3a">

					<?php if ( !dynamic_sidebar( 'homepage-column-1-widget-area' ) && current_user_can('edit_theme_options') ) : ?>

								<h2 class="sidebar-title">
									<?php esc_html_e('Home Col Widget 1', 'ayabooks'); ?>
								</h2><!-- .sidebar-title -->
								
								<div class="sidebar-after-title">
								</div><!-- .sidebar-after-title -->
								
								<div class="textwidget">
									<?php esc_html_e('This is first homepage widget area. To customize it, please navigate to Admin Panel -> Appearance -> Widgets and add widgets to Homepage Column #1.', 'ayabooks'); ?>
								</div><!-- .textwidget -->
					
					<?php endif; // end of ! dynamic_sidebar( 'homepage-column-1-widget-area' )
						  ?>

				</div><!-- .col3a -->

		<?php endif; ?>

		<?php if ( is_active_sidebar( 'homepage-column-2-widget-area' ) ) : ?>
		
				<?php 
					/**
					 * Display widgets dragged in 'Homepage Columns 2' widget areas
					 */
				?>
				<div class="col3b">
					<?php if ( !dynamic_sidebar( 'homepage-column-2-widget-area' ) && current_user_can('edit_theme_options') ) : ?>
					
							<h2 class="sidebar-title">
								<?php esc_html_e('Home Col Widget 2', 'ayabooks'); ?>
							</h2><!-- .sidebar-title -->
							
							<div class="sidebar-after-title">
							</div><!-- .sidebar-after-title -->
							
							<div class="textwidget">
								<?php esc_html_e('This is second homepage widget area. To customize it, please navigate to Admin Panel -> Appearance -> Widgets and add widgets to Homepage Column #2.', 'ayabooks'); ?>
							</div><!-- .textwidget -->
								
					<?php endif; // end of ! dynamic_sidebar( 'homepage-column-2-widget-area' )
						  ?>
					
				</div><!-- .col3b -->

		<?php endif; ?>

		<?php if ( is_active_sidebar( 'homepage-column-3-widget-area' ) ) : ?>

				<?php 
					/**
					 * Display widgets dragged in 'Homepage Columns 3' widget areas
					 */
				?>
				<div class="col3c">
					<?php if ( !dynamic_sidebar( 'homepage-column-3-widget-area' ) && current_user_can('edit_theme_options') ) : ?>
					
							<h2 class="sidebar-title">
								<?php esc_html_e('Home Col Widget 3', 'ayabooks'); ?>
							</h2><!-- .sidebar-title -->
							
							<div class="sidebar-after-title">
							</div><!-- .sidebar-after-title -->
							
							<div class="textwidget">
								<?php esc_html_e('This is third homepage widget area. To customize it, please navigate to Admin Panel -> Appearance -> Widgets and add widgets to Homepage Column #3.', 'ayabooks'); ?>
							</div><!-- .textwidget -->
								
					<?php endif; // end of ! dynamic_sidebar( 'homepage-column-3-widget-area' )
						  ?>
					
				</div><!-- .col3c -->

		<?php endif; ?>
		
		<div class="clear">
		</div><!-- .clear -->

	</div><!-- #home-cols-inner -->

</div><!-- #home-cols -->