
import React from 'react'
import Helmet from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Layout.sass"
import { siteMetaData } from '../../config/siteMetaData';
import withUsersService, { WithUsersServiceProps } from '../../modules/users/hocs/withUsersService';
import NewHeader from '../components/header/components/NewHeader';
import { Footer } from '../components/footer';
import { UsersState } from '../../modules/users/redux/states';
import { User } from '../../modules/users/models/user';
import { connect } from "react-redux";

interface LayoutProps extends WithUsersServiceProps {
  users?: UsersState;
  children?: React.ReactNode;
  onLogout?: () => void;
}

class Layout extends React.Component<LayoutProps> {
  handleLogout = () => {
    if (this.props.onLogout) {
      this.props.onLogout();
    }
  }

  render () {
    const { users } = this.props;
    const isLoggedIn = users?.isAuthenticated || false;
    const username = isLoggedIn && users?.user ? (users.user as User).username : '';

    return (
      <div className="app-layout">
        {
          //@ts-ignore
          <Helmet>
            <title>{siteMetaData.title}</title>
            {/* TODO: The rest */}
            <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,400i,500,700,700i&display=swap" rel="stylesheet"></link>
            <link rel="stylesheet" href="//cdn.quilljs.com/1.2.6/quill.snow.css"></link>
          </Helmet>
        }
        <ToastContainer/>
        <NewHeader
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={this.handleLogout}
        />
        <div className="app-layout-inner">
          {this.props.children}
        </div>
        <Footer />
      </div>
    )
  }
}

function mapStateToProps ({ users }: { users: UsersState }) {
  return {
    users
  };
}

// Explicitly type the final component to preserve children prop
const WrappedLayout: React.FC<{ children?: React.ReactNode; onLogout?: () => void }> =
  connect(mapStateToProps)(withUsersService(Layout)) as any;

export default WrappedLayout;