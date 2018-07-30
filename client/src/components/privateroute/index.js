class PrivateRoute extends Component {

  render() {

    const { component, token, isAuthenticating, isAuthenticated,
            providers,  ...rest } = this.props;

    if (!isAuthenticated && !isAuthenticating) {
      store.dispatch(authenticate(token));
    }

    const render = (props) => {
      if (isAuthenticated) {
        return React.createElement(component, props)
      }

      if (providers && providers.Google) {
        window.location = providers.Google;
        return (null);
      }

      return <div>Authenticating...</div>
    }

    return <Route {...rest} render={render}/>
  }
}

PrivateRoute.propTypes = {
    token: PropTypes.string,
    isAuthenticating: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
    providers: PropTypes.object
  }

PrivateRoute.defaultProps = {
  token: null,
  isAuthenticating: false,
  isAuthenticated: false,
  providers: null
}

function mapStateToProps(state, ownProps) {
  const token = selectors.girder.getToken(state);
  const isAuthenticating = selectors.girder.isAuthenticating(state);
  const isAuthenticated = selectors.girder.isAuthenticated(state);
  const providers = selectors.girder.getOauthProviders(state);

  return {
    token,
    isAuthenticating,
    isAuthenticated,
    providers,
  }
}

PrivateRoute = connect(mapStateToProps)(PrivateRoute)
