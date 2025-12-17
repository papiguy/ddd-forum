
import React from 'react'
import withRouter, { WithRouterProps } from '../shared/infra/router/withRouter';

interface MemberPageProps extends WithRouterProps {}

class MemberPage extends React.Component<MemberPageProps> {
  getUserName () {
    return this.props.params.username;
  }

  render () {
    const username = this.getUserName();
    return (
      <div>
        <h1>Member</h1>
        <h2>{username}</h2>
        <p>Nothing here just yet :p</p>
      </div>
    )
  }
}

export default withRouter(MemberPage);