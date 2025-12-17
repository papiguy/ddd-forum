
import React from 'react'
import { Navigate } from 'react-router-dom'
//@ts-ignore
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as usersOperators from '../../../modules/users/redux/operators'
import { UsersState } from '../../../modules/users/redux/states';

interface UnAuthenticatedRouteProps {
  users: UsersState;
  children: React.ReactNode;
}

/**
 * This route is only visible to users who are not currently authenticted.
*/

const UnauthenticatedRoute: React.FC<UnAuthenticatedRouteProps> = ({ users, children }) => {
  // Add your own authentication on the below line.
  const isLoggedIn = users.isAuthenticated;

  return !isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  )
}

function mapStateToProps ({ users }: { users: UsersState }) {
  return {
    users
  };
}

function mapActionCreatorsToProps(dispatch: any) {
  return bindActionCreators(
    {
      ...usersOperators,
    }, dispatch);
}

export default connect(mapStateToProps, mapActionCreatorsToProps)(
  UnauthenticatedRoute
);