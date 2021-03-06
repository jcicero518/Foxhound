/** @format */
/**
 * External Dependencies
 */
import React from 'react';
import BodyClass from 'react-body-class';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import he from 'he';
import { getUser, getUserIdFromName, isRequestingUser } from 'wordpress-query-user/lib/selectors';
import QueryUser from 'wordpress-query-user';

/**
 * Internal Dependencies
 */
import List from './list';
import Placeholder from 'components/placeholder';

const AuthorHeader = ( { userName, loading, user = {}, query = {} } ) => {
	const meta = {
		title: he.decode( `${ user.name } – ${ FoxhoundSettings.meta.title }` ),
	};

	return (
		<div className="card">
			<DocumentMeta { ...meta } />
			<BodyClass classes={ [ 'archive', 'author' ] } />
			<QueryUser userId={ userName } />
			{ loading ? (
				<Placeholder type="author" />
			) : (
				<div>
					<header className="page-header">
						<h1 className="page-title">Archive for { user.name }</h1>
						{ user.description && <p>{ user.description }</p> }
					</header>
					<List query={ query } author={ user.slug } />
				</div>
			) }
		</div>
	);
};

export default connect( ( state, { match } ) => {
	const userName = match.params.slug;
	const user = getUser( state, userName );
	const userId = getUserIdFromName( state, userName );
	const requesting = isRequestingUser( state, userName );

	const query = {};
	query.page = match.params.paged || 1;
	if ( userId ) {
		query.author = [ userId ];
	}

	return {
		query,
		userName,
		user,
		requesting,
		loading: requesting && ! user,
	};
} )( AuthorHeader );
