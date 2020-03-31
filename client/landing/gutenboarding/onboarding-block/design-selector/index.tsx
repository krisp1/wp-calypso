/**
 * External dependencies
 */
import React from 'react';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import { useI18n } from '@automattic/react-i18n';
import { useHistory } from 'react-router-dom';
import { MShotsImage } from './MShotsImage';
/**
 * Internal dependencies
 */
import { STORE_KEY as ONBOARD_STORE } from '../../stores/onboard';
import designs from '../../available-designs';
import { usePath, Step } from '../../path';
import { isEnabled } from '../../../../config';
import Link from '../../components/link';
import { SubTitle, Title } from '../../components/titles';

import './style.scss';

type Design = import('../../stores/onboard/types').Design;

const makeOptionId = ( { slug }: Design ): string => `design-selector__option-name__${ slug }`;

const DesignSelector: React.FunctionComponent = () => {
	const { __: NO__ } = useI18n();
	const { push } = useHistory();
	const makePath = usePath();
	const { setSelectedDesign, setFonts, resetOnboardStore } = useDispatch( ONBOARD_STORE );

	const getDesignPreview = ( design: Design ) => {
		// We temporarily show pre-generated screenshots until we can generate tall versions dynamically using mshots.
		// See `bin/generate-gutenboarding-design-thumbnails.js` for generating screenshots.
		// https://github.com/Automattic/mShots/issues/16
		// https://github.com/Automattic/wp-calypso/issues/40564
		if ( ! isEnabled( 'gutenboarding/mshot-preview' ) ) {
			return (
				<img
					src={ `/calypso/page-templates/design-screenshots/${ design.slug }_${ design.template }_${ design.theme }.jpg` }
					alt={ design.title }
					key={ design.slug }
					aria-labelledby={ makeOptionId( design ) }
				/>
			);
		}

		const previewUrl = addQueryArgs( design.src, {
			font_headings: design.fonts.headings,
			font_base: design.fonts.base,
		} );

		return (
			<MShotsImage
				className={ `design-selector__preview-image-${ design.slug }` }
				alt={ design.title }
				siteUrl={ encodeURIComponent( previewUrl ) }
				key={ design.slug }
				aria-labelledby={ makeOptionId( design ) }
			/>
		);
	};

	return (
		<div className="design-selector">
			<div className="design-selector__header">
				<div className="design-selector__heading">
					<Title>{ NO__( 'Choose a starting design' ) }</Title>
					<SubTitle>
						{ NO__(
							'Get started with one of our top website layouts. You can always change it later'
						) }
					</SubTitle>
				</div>
				<Link
					className="design-selector__start-over-button"
					onClick={ () => resetOnboardStore() }
					to={ makePath( Step.IntentGathering ) }
					isLink
				>
					{ NO__( 'Start over' ) }
				</Link>
			</div>
			<div className="design-selector__design-grid">
				<div className="design-selector__grid">
					{ designs.featured.map( design => (
						<button
							key={ design.slug }
							className="design-selector__design-option"
							onClick={ () => {
								setSelectedDesign( design );

								// Update fonts to the design defaults
								setFonts( design.fonts );

								if ( isEnabled( 'gutenboarding/style-preview' ) ) {
									push( makePath( Step.Style ) );
								}
							} }
						>
							<span className="design-selector__image-frame">{ getDesignPreview( design ) }</span>
							<span className="design-selector__option-overlay">
								<span id={ makeOptionId( design ) } className="design-selector__option-name">{ design.title }</span>
							</span>
						</button>
					) ) }
				</div>
			</div>
		</div>
	);
};

export default DesignSelector;
