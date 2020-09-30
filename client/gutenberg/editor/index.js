/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import { siteSelection, sites } from 'my-sites/controller';
import { authenticate, post, siteEditor } from './controller';
import config from 'config';
import { makeLayout, render as clientRender } from 'controller';

export default function () {
	page( '/site-editor/:site?', siteSelection, authenticate, siteEditor, makeLayout, clientRender );

	page( '/post', siteSelection, sites, makeLayout, clientRender );
	page( '/post/:site?', siteSelection, makeLayout, clientRender );
	page( '/post/:site/:post?', siteSelection, authenticate, post, makeLayout, clientRender );

	page( '/page', siteSelection, sites, makeLayout, clientRender );
	page( '/page/:site?', siteSelection, makeLayout, clientRender );
	page( '/page/:site/:post?', siteSelection, authenticate, post, makeLayout, clientRender );

	if ( config.isEnabled( 'manage/custom-post-types' ) ) {
		page( '/edit/:customPostType', siteSelection, sites, makeLayout, clientRender );
		page(
			'/edit/:customPostType/:site/:post?',
			siteSelection,
			authenticate,
			post,
			makeLayout,
			clientRender
		);
		page( '/edit/:customPostType/:site?', siteSelection, makeLayout, clientRender );
	}

	page( '/*/*', '/post' );
	page( '/:site', ( context ) => page.redirect( `/block-editor/post/${ context.params.site }` ) );
}
