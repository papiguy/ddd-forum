
import React from 'react';
import { usersService } from '../services';
import { UsersService } from '../services/userService';

export interface WithUsersServiceProps {
  usersService: UsersService;
}

function withUsersService<P extends WithUsersServiceProps>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<Omit<P, 'usersService'>> {
  type PropsWithoutUsersService = Omit<P, 'usersService'>;

  return class extends React.Component<PropsWithoutUsersService> {
    render() {
      return (
        <WrappedComponent
          {...(this.props as P)}
          usersService={usersService}
        />
      );
    }
  } as React.ComponentType<PropsWithoutUsersService>;
}

export default withUsersService;