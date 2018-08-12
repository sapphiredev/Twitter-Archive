import React from 'react';

import {
	updateHistoryIfNeeded,
	openModal,
} from '../../actions';

import {
	Tweet,
} from '../../../shared/models';

import {
	ProfileComponent,
	TextComponent,
	MediaComponent,
	FooterComponent,
} from '../../components';

import {
	Segment,
} from 'semantic-ui-react';

interface ComponentProps {
	tweet: Tweet;
	isRetweet: boolean;
	isQuote: boolean;

	updateHistoryIfNeeded: typeof updateHistoryIfNeeded;
	openModal: typeof openModal;
}

export class TweetComponent extends React.Component<ComponentProps> {
	private getExtendedTweet(tweet: Tweet) {
		return (tweet as any).extended_tweet;
	}

	private getText(tweet: Tweet) {
		const extendedTweet = this.getExtendedTweet(tweet);
		if(extendedTweet === undefined) {
			return tweet.text;
		}
		return extendedTweet.full_text;
	}

	private getEntities(tweet: Tweet) {
		const extendedTweet = this.getExtendedTweet(tweet);

		if(extendedTweet !== undefined) {
			if(extendedTweet.extended_entities !== undefined) {
				return {
					...extendedTweet.entities,
					...extendedTweet.extended_entities,
				};
			}
			return extendedTweet.entities;
		}
		else {
			if((tweet as any).extended_entities !== undefined) {
				return {
					...tweet.entities,
					...(tweet as any).extended_entities,
				};
			}
			return tweet.entities;
		}
	}

	public render() {
		const {
			tweet,
			isQuote,
		} = this.props;

		const {
			quoted_status,
		} = tweet;

		const text = this.getText(tweet);
		const entities = this.getEntities(tweet);

		return (
			<div className="tweet">
				<ProfileComponent {...this.props} isQuote={isQuote} />
				<Segment.Group size="tiny">
					<Segment>
						<TextComponent text={text} entities={entities} />
					</Segment>
					{(() => {
						if(entities === undefined) {
							return null;
						}

						if(entities.media === undefined) {
							return null;
						}
						return (
							<Segment>
								<MediaComponent
									{...this.props}
									entities={entities}
								/>
							</Segment>
						);
					})()}
					{(() => {
						if(quoted_status === undefined) {
							return null;
						}
						return (
							<Segment>
								<TweetComponent {...this.props} tweet={quoted_status} isQuote={true} />
							</Segment>
						);
					})()}
					<FooterComponent {...this.props} />
				</Segment.Group>
			</div>
		);
	}
}
