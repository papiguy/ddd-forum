
import React from 'react'
import { Layout } from '../shared/layout';
import { Post } from '../modules/forum/models/Post';
import { toast } from 'react-toastify';
import PostSummary from '../modules/forum/components/posts/post/components/PostSummary';
import PostComment from '../modules/forum/components/posts/post/components/PostComment';
import { Comment } from '../modules/forum/models/Comment';
import { CommentUtil } from '../modules/forum/utils/CommentUtil';
import { UsersState } from '../modules/users/redux/states';
//@ts-ignore
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as usersOperators from '../modules/users/redux/operators'
import withLogoutHandling from '../modules/users/hocs/withLogoutHandling';
import * as forumOperators from '../modules/forum/redux/operators'
import { ForumState } from '../modules/forum/redux/states';
import Editor from '../modules/forum/components/comments/components/Editor';
import { SubmitButton } from '../shared/components/button';
import { TextUtil } from '../shared/utils/TextUtil';
import { FullPageLoader } from '../shared/components/loader';
import withVoting from '../modules/forum/hocs/withVoting';
import withRouter, { WithRouterProps } from '../shared/infra/router/withRouter';

interface DiscussionPageProps extends usersOperators.IUserOperators, forumOperators.IForumOperations, WithRouterProps {
  users: UsersState;
  forum: ForumState;
}

interface DiscussionState {
  comments: Comment[];
  newCommentText: string;
}

class DiscussionPage extends React.Component<DiscussionPageProps, DiscussionState> {
  constructor (props: DiscussionPageProps) {
    super(props);

    this.state = {
      comments: [],
      newCommentText: '',
    }
  }

  getSlug (): string {
    return this.props.params.slug || '';
  }

  getPost (): void {
    const slug = this.getSlug();
    this.props.getPostBySlug(slug);
  }

  getComments (offset?: number): void {
    const slug = this.getSlug();
    this.props.getComments(slug, offset);
  }

  componentDidMount () {
    this.getPost();
    this.getComments();
  }

  updateValue (fieldName: string, newValue: any) {
    this.setState({
      ...this.state,
      [fieldName]: newValue
    })
  }

  isFormValid () : boolean {
    const { newCommentText } = this.state;

    if (!!newCommentText === false ||
      TextUtil.atLeast(newCommentText, CommentUtil.minCommentLength) ||
      TextUtil.atMost(newCommentText, CommentUtil.maxCommentLength)
    ) {
      toast.error(`Yeahhhhh, comments should be ${CommentUtil.minCommentLength} to ${CommentUtil.maxCommentLength} characters. Yours was ${newCommentText.length}. 🤠`, {
        autoClose: 3000
      })
      return false;
    }

    return true;
  }

  onSubmitComment () {
    if (this.isFormValid()) {
      const text = this.state.newCommentText;
      const slug  = (this.props.forum.post as Post).slug;
      this.props.createReplyToPost(text, slug);
    }
  }

  afterSuccessfulCommentPost (prevProps: DiscussionPageProps) {
    const currentProps: DiscussionPageProps = this.props;
    if (currentProps.forum.isCreatingReplyToPostSuccess === !prevProps.forum.isCreatingReplyToPostSuccess) {
      toast.success(`Done-zo! 🤠`, {
        autoClose: 2000
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000)
    }
  }

  afterFailedCommentPost (prevProps: DiscussionPageProps) {
    const currentProps: DiscussionPageProps = this.props;
    if (currentProps.forum.isCreatingReplyToPostFailure === !prevProps.forum.isCreatingReplyToPostFailure) {
      const error: string = currentProps.forum.error;
      return toast.error(`Yeahhhhh, ${error} 🤠`, {
        autoClose: 3000
      })
    }
  }

  componentDidUpdate (prevProps: DiscussionPageProps) {
    this.afterSuccessfulCommentPost(prevProps);
    this.afterFailedCommentPost(prevProps);
  }

  render () {
    const post = this.props.forum.post as Post;
    const comments = this.props.forum.comments;

    return (
      <Layout onLogout={() => this.props.logout()}>
        {this.props.forum.isGettingPostBySlug ? (
          ''
        ) : (
          <>
            <PostSummary
              {...post as Post}
            />
            <h3>Leave a comment</h3>
            <Editor
              text={this.state.newCommentText}
              maxLength={CommentUtil.maxCommentLength}
              placeholder="Post your reply"
              handleChange={(v: any) => this.updateValue('newCommentText', v)}
            />
            <SubmitButton
              text="Post comment"
              onClick={() => this.onSubmitComment()}
            />
          </>
        )}

        <br/>
        <br/>
        <br/>
        {comments.map((c, i) => (
          <PostComment
            key={i}
            onDownvoteClicked={() => this.props.downvoteComment(c.commentId)}
            onUpvoteClicked={() => this.props.upvoteComment(c.commentId)}
            isLoggedIn={this.props.users.isAuthenticated}
            {...c}
          />
        ))}

        {this.props.forum.isCreatingReplyToPost ? <FullPageLoader/> : '' }
      </Layout>
    )
  }
}


function mapStateToProps ({ users, forum }: { users: UsersState, forum: ForumState }) {
  return {
    users,
    forum
  };
}

function mapActionCreatorsToProps(dispatch: any) {
  return bindActionCreators(
    {
      ...usersOperators,
      ...forumOperators
    }, dispatch);
}

export default connect(mapStateToProps, mapActionCreatorsToProps)(
  withLogoutHandling(
    withVoting(
      withRouter(DiscussionPage)
    )
  )
);
