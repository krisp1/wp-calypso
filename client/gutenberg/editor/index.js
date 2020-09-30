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
	page( '/post/new', () => page.redirect( '/post' ) ); // redirect from beep-beep-boop
	page( '/post/:site/:post?', siteSelection, authenticate, post, makeLayout, clientRender );
	page( '/post/:site?', siteSelection, makeLayout, clientRender );

	page( '/page', siteSelection, sites, makeLayout, clientRender );
	page( '/page/new', () => page.redirect( '/page' ) ); // redirect from beep-beep-boop
	page( '/page/:site/:post?', siteSelection, authenticate, post, makeLayout, clientRender );
	page( '/page/:site?', siteSelection, makeLayout, clientRender );

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

	// Redirect old block-editor routes.
	page( '/block-editor/post/', '/post' );
	page( '/block-editor/post/:site/:post?', ( { params = {} } ) => {
		const { site, post: postId } = params;
		if ( postId ) {
			return page.redirect( `/post/${ site }/${ postId }` );
		}
		page.redirect( `/post/${ site }/` );
	} );

	page( '/block-editor/page/', '/page' );
	page( '/block-editor/page/:site/:page?', ( { params = {} } ) => {
		const { site, page: pageId } = params;
		if ( pageId ) {
			return page.redirect( `/page/${ site }/${ pageId }` );
		}
		page.redirect( `/page/${ site }/` );
	} );

	page( '/*/*', '/post' );
	page( '/:site', ( context ) => page.redirect( `/block-editor/post/${ context.params.site }` ) );
}
