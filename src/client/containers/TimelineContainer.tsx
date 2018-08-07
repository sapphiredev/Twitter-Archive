import React from 'react';

import {
	bindActionCreators,
	Dispatch,
	AnyAction,
} from 'redux';

import {
	connect,
} from 'react-redux';

import {
	updateHistoryIfNeeded,
	openModal,
} from '../actions';

import {
	State,
} from '../reducers';

import {
	getIsFetchingTweets,
	getTweets,
	getHistoryID,
} from '../selectors';

import {
	Tweet,
} from '../../shared/models';

import {
	PlaceholderComponent,
	TweetElementComponent,
} from '../components';

import {
	Segment,
} from 'semantic-ui-react';

import '../styles/Tweets.scss';

interface ComponentProps {
	isFetchingTweets: boolean;
	tweets: Tweet[];
	historyID: string;

	updateHistoryIfNeeded: typeof updateHistoryIfNeeded;
	openModal: typeof openModal;
}

class TimelineComponent extends React.Component<ComponentProps> {
	public render() {
		const {
			tweets,
			historyID,
		} = this.props;

		return (
			<div>
				<Segment.Group size="tiny">
					<PlaceholderComponent {...this.props} />
					{tweets.filter((tweet) => {
						return tweet.id_str >= historyID;
					}).map((tweet) => {
						return (
							<TweetElementComponent key={tweet.id_str} tweet={tweet} {...this.props} />
						);
					})}
				</Segment.Group>
			</div>
		);
	}
}

function mapStateToProps(state: State) {
	return {
		'tweets': getTweets(state),
		'isFetchingTweets': getIsFetchingTweets(state),
		'historyID': getHistoryID(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
	return bindActionCreators({
		'updateHistoryIfNeeded': updateHistoryIfNeeded,
		'openModal': openModal,
	}, dispatch);
}

export const TimelineContainer = connect(mapStateToProps, mapDispatchToProps)(TimelineComponent);
