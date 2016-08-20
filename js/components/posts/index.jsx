/*global FoxhoundSettings */
// External dependencies
import React from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';

// Internal dependencies
import QueryPosts from 'data/query-posts';
import { isRequestingPostsForQuery, getPostsForQuery, getTotalPagesForQuery } from 'data/state/selectors';

// Components
import PostList from './list';
import Pagination from '../pagination/archive';

const Index = React.createClass( {
	renderPlaceholder() {
		return (
			<div className="placeholder">Your posts are loading…</div>
		);
	},

	render() {
		const posts = this.props.posts || [];
		const meta = {
			title: FoxhoundSettings.meta.title,
			description: FoxhoundSettings.meta.description,
			canonical: FoxhoundSettings.URL.base,
		};

		return (
			<div className="site-content">
				<DocumentMeta { ...meta } />
				<QueryPosts query={ this.props.query } />
				{ this.props.requesting ?
					this.renderPlaceholder() :
					<PostList posts={ posts } />
				}
				<Pagination current={ this.props.page } isFirstPage={ 1 === this.props.page } isLastPage={ this.props.totalPages === this.props.page } />
			</div>
		);
	}
} );

export default connect( ( state, ownProps ) => {
	let query = {};
	query.paged = ownProps.params.paged || 1;

	return {
		page: parseInt( query.paged ),
		query: query,
		posts: getPostsForQuery( state, query ),
		totalPages: getTotalPagesForQuery( state, query ),
		requesting: isRequestingPostsForQuery( state, query )
	};
} )( Index );
