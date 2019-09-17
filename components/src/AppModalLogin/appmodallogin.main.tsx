/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

import React from 'react';
import * as cortex from '@elasticpath/cortex-client';
import { Link, withRouter } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import queryString from 'query-string';
import { loginRegisteredAuthService } from '../utils/AuthService';
import './appmodallogin.main.less';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import { ClientContext } from '../ClientContext';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface AppModalLoginMainProps {
    handleModalClose: (...args: any[]) => any,
    openModal: boolean,
    onLogin?: (...args: any[]) => any,
    onResetPassword?: (...args: any[]) => any,
    locationSearchData?: string,
    appModalLoginLinks: {
        [key: string]: any
    },
    showForgotPasswordLink: boolean,
    disableLogin?: boolean,
}
interface AppModalLoginMainState {
    username: string,
    password: string,
    failedLogin: boolean,
    isLoading: boolean,
}
class AppModalLoginMain extends React.Component<AppModalLoginMainProps, AppModalLoginMainState> {
  static contextType = ClientContext;

  static defaultProps = {
    onLogin: () => {},
    onResetPassword: () => {},
    locationSearchData: undefined,
    disableLogin: false,
  }

  client: cortex.IClient;

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = getConfig());
    this.state = {
      username: '',
      password: '',
      failedLogin: false,
      isLoading: false,
    };
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.loginRegisteredUser = this.loginRegisteredUser.bind(this);
    this.registerNewUser = this.registerNewUser.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  componentDidMount() {
    this.client = this.context;
  }

  componentWillMount() {
    const { locationSearchData, onLogin } = this.props;
    const url = locationSearchData;
    const params = queryString.parse(url);
    if (params.code) {
      localStorage.setItem(`${Config.cortexApi.scope}_keycloakCode`, params.code);
      localStorage.setItem(`${Config.cortexApi.scope}_keycloakSessionState`, params.session_state);
      if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) !== 'REGISTERED') {
        loginRegisteredAuthService(params.code, encodeURIComponent(Config.b2b.keycloak.callbackUrl), encodeURIComponent(Config.b2b.keycloak.client_id)).then((resStatus) => {
          if (resStatus === 401) {
            this.setState({
              failedLogin: true,
              isLoading: false,
            });
          }
          if (resStatus === 400) {
            this.setState({
              failedLogin: true,
              isLoading: false,
            });
          } else if (resStatus === 200) {
            this.setState({ failedLogin: false });
            onLogin();
          }
        });
      }
    }
  }

  setUsername(event) {
    this.setState({ username: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  registerNewUser() {
    const { handleModalClose } = this.props;
    handleModalClose();
  }

  async loginRegisteredUser(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const { handleModalClose, onLogin, disableLogin } = this.props;
    this.setState({ isLoading: true });
    if (!disableLogin) {
      try {
        if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`) != null) {
          const result = await this.client.serverFetch('/oauth2/tokens', {
            method: 'post',
            useAuth: false,
            urlEncoded: true,
            body: {
              username,
              password,
              grant_type: 'password',
              role: 'REGISTERED',
              scope: Config.cortexApi.scope,
            },
          });
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${result.parsedJson.access_token}`);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, result.parsedJson.role);
          if (result.status === 200) {
            this.setState({ failedLogin: false });
            handleModalClose();
            onLogin();
          }
        }
      } catch (error) {
        this.setState({
          failedLogin: true,
          isLoading: false,
        });
        // eslint-disable-next-line no-console
        console.error(error);
      }
    } else {
      this.setState({ isLoading: false });
    }
  }

  resetPassword() {
    const { handleModalClose, onResetPassword } = this.props;
    onResetPassword();
    handleModalClose();
  }

  render() {
    const { failedLogin, isLoading } = this.state;
    const {
      handleModalClose, openModal, appModalLoginLinks, showForgotPasswordLink,
    } = this.props;

    return (
      <Modal open={openModal} onClose={handleModalClose} classNames={{ modal: 'login-modal-content' }}>
        <div id="login-modal">
          <div className="modal-content" id="simplemodal-container">

            <div className="modal-header">
              <h2 className="modal-title">
                {intl.get('login')}
              </h2>
            </div>

            <div className="feedback-label auth-feedback-container" id="login_modal_auth_feedback_container" data-region="authLoginFormFeedbackRegion" data-i18n="">
              {failedLogin ? (intl.get('invalid-username-or-password')) : ('')}
            </div>

            <div className="modal-body">
              <form id="login_modal_form" onSubmit={this.loginRegisteredUser}>
                <div className="form-group">
                  <span>
                    {intl.get('username')}
                    :
                  </span>
                  <input className="form-control" id="login_modal_username_input" type="text" onChange={this.setUsername} />
                </div>
                <div className="form-group">
                  <span>
                    {intl.get('password')}
                    :
                  </span>
                  <input className="form-control" id="login_modal_password_input" type="password" onChange={this.setPassword} />
                </div>
                <div className="form-group action-row">
                  {
                    (isLoading) ? <div className="miniLoader" /> : ('')
                  }
                  {showForgotPasswordLink && <button type="button" className="label-link" onClick={this.resetPassword}>{intl.get('forgot-password')}</button>}
                  <div className="form-input btn-container">
                    <button className="ep-btn primary btn-auth-login" id="login_modal_login_button" data-cmd="login" data-toggle="collapse" data-target=".navbar-collapse" type="submit">
                      {intl.get('login')}
                    </button>
                    <Link to={appModalLoginLinks.registration}>
                      <button className="ep-btn btn-auth-register" id="login_modal_register_button" data-toggle="collapse" data-target=".navbar-collapse" type="button" onClick={this.registerNewUser}>
                        {intl.get('register')}
                      </button>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withRouter(AppModalLoginMain);
