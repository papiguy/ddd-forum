
import React from 'react'
import { Navigate } from 'react-router-dom'
import { UsersState } from '../../../modules/users/redux/states';
//@ts-ignore
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as usersOperators from '../../../modules/users/redux/operators'

interface AuthenticatedRouteProps {
  users: UsersState;
  children: React.ReactNode;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ users, children }) => {
  // Add your own authentication on the below line.
  const isLoggedIn = users.isAuthenticated;

  return isLoggedIn ? (
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
  AuthenticatedRoute
);