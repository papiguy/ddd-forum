import React from 'react';
import { useNavigate, useParams, useLocation, NavigateFunction, Location, Params } from 'react-router-dom';

export interface WithRouterProps {
  navigate: NavigateFunction;
  params: Readonly<Params<string>>;
  location: Location;
}

function withRouter<P extends WithRouterProps>(Component: React.ComponentType<P>) {
  return (props: Omit<P, keyof WithRouterProps>) => {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    return (
      <Component
        {...(props as P)}
        navigate={navigate}
        params={params}
        location={location}
      />
    );
  };
}

export default withRouter;
