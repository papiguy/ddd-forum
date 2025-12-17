
import React from 'react';
import { Layout } from '../shared/layout';
import { PostFilterType } from '../modules/forum/components/posts/filters/components/PostFilters';
import { Post } from '../modules/forum/models/Post';
import { PostRow } from '../modules/forum/components/posts/postRow';
import { UsersState } from '../modules/users/redux/states';
//@ts-ignore
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as usersOperators from '../modules/users/redux/operators'
import * as forumOperators from '../modules/forum/redux/operators'
import { User } from '../modules/users/models/user';
import withLogoutHandling from '../modules/users/hocs/withLogoutHandling';
import { ForumState } from '../modules/forum/redux/states';
import withVoting from '../modules/forum/hocs/withVoting';
import withRouter, { WithRouterProps } from '../shared/infra/router/withRouter';

interface IndexPageProps extends usersOperators.IUserOperators, forumOperators.IForumOperations, WithRouterProps {
  users: UsersState;
  forum: ForumState;
}

interface IndexPageState {
  activeFilter: PostFilterType;
}

class IndexPage extends React.Component<IndexPageProps, IndexPageState> {
  constructor (props: IndexPageProps) {
    super(props);

    this.state = {
      activeFilter: 'POPULAR'
    }
  }

  onClickJoinButton () {

  }

  setActiveFilter (filter: PostFilterType) {
    this.setState({
      ...this.state,
      activeFilter: filter
    })
  }

  getPosts () {
    const activeFilter = this.state.activeFilter;

    if (activeFilter === 'NEW') {
      this.props.getRecentPosts();
    } else {
      this.props.getPopularPosts();
    }
  }

  onFilterChanged (prevState: IndexPageState) {
    const currentState: IndexPageState = this.state;
    if (prevState.activeFilter !== currentState.activeFilter) {
      this.getPosts();
    }
  }

  setActiveFilterOnLoad () {
    const showNewFilter = (this.props.location.search as string).includes('show=new');

    let activeFilter = this.state.activeFilter;

    if (showNewFilter) {
      activeFilter = 'NEW';
    }

    this.setState({
      ...this.state,
      activeFilter
    })
  }

  getPostsFromActiveFilterGroup (): Post[] {
    if (this.state.activeFilter === 'NEW') {
      return this.props.forum.recentPosts;
    } else {
      return this.props.forum.popularPosts;
    }
  }

  componentDidUpdate (prevProps: IndexPageProps, prevState: IndexPageState) {
    // Check if URL changed (user clicked filter in header)
    if (prevProps.location.search !== this.props.location.search) {
      this.setActiveFilterOnLoad();
    }
    this.onFilterChanged(prevState)
  }

  componentDidMount () {
    this.setActiveFilterOnLoad();
    this.getPosts();
  }

  render () {
    console.log(this.props)
    const { activeFilter } = this.state;

    return (
      <Layout onLogout={() => this.props.logout()}>
        {this.getPostsFromActiveFilterGroup().map((p, i) => (
          <PostRow
            key={i}
            onUpvoteClicked={() => this.props.upvotePost(p.slug)}
            onDownvoteClicked={() => this.props.downvotePost(p.slug)}
            isLoggedIn={this.props.users.isAuthenticated}
            {...p}
          />
        ))}

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
      withRouter(IndexPage)
    )
  )
);