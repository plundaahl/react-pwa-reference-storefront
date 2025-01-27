
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
import intl from 'react-intl-universal';
import SubAccountList from './SubAccountList';

import './AccountMain.less';

interface AccountMainProps {
    getAccountData: () => void,
    getSubAccountData?: (data: any) => void,
    handleAddSubAccountClicked: () => void,
    accountListData: {
        status: string,
        subAccounts: any,
        mainAccountName: string,
    },
    accountName: string,
    registrationNumber: string,
}

interface AccountMainState {
  showAccountsMobileMenu: boolean,
}

export default class AccountList extends React.Component<AccountMainProps, AccountMainState> {
    static defaultProps = {
      getSubAccountData: () => {
      },
    };

    constructor(props: any) {
      super(props);
      this.state = {
        showAccountsMobileMenu: false,
      };

      this.handleAccount = this.handleAccount.bind(this);
      this.handleOpenAccountsMobileMenu = this.handleOpenAccountsMobileMenu.bind(this);
      this.handleCloseAccountsMobileMenu = this.handleCloseAccountsMobileMenu.bind(this);
    }

    componentDidMount() {
      document.body.style.overflow = 'unset';
    }

    handleAccount(data) {
      const { getSubAccountData } = this.props;
      getSubAccountData(data);
    }

    handleOpenAccountsMobileMenu() {
      this.setState({ showAccountsMobileMenu: true });
      document.body.style.overflow = 'hidden';
    }

    handleCloseAccountsMobileMenu() {
      this.setState({ showAccountsMobileMenu: false });
      document.body.style.overflow = 'unset';
    }

    render() {
      const {
        getAccountData,
        handleAddSubAccountClicked,
        accountListData,
        accountName,
        registrationNumber,
      } = this.props;

      const { showAccountsMobileMenu } = this.state;

      return (
        <div key="account-tree-section" className="account-tree-section">
          <div className="add-new-account-container">
            <button type="button" className="ep-btn primary small add-associate-button" onClick={handleAddSubAccountClicked}>
              <span className="add-associate-icon" />
              {intl.get('add-sub-account')}
            </button>
          </div>
          <div className="mobile-account-selector-container">
            <h4 className="title">
              {intl.get('account')}
            </h4>
            <button type="button" className="account-selector" onClick={this.handleOpenAccountsMobileMenu}>
              {accountName}
            </button>
          </div>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div className={`${showAccountsMobileMenu ? 'show-account-tree-mobile-menu' : ''} account-tree-component`}>
            <div className="mobile-account-tree-header">
              <div className="mobile-header">
                <h4>
                  {intl.get('account')}
                </h4>
                <button type="button" className="ep-btn primary small save-btn" onClick={this.handleCloseAccountsMobileMenu}>
                  {intl.get('save')}
                </button>
              </div>
              <p>
                {intl.get('choose-account')}
              </p>
            </div>
            <div className="account-tree-container" role="presentation" onClick={getAccountData}>
              <div className="name">
                {accountListData.mainAccountName}
              </div>
              <span className="status">
                <i className={`icons-status ${accountListData.status.toLowerCase()}`} />
                {intl.get(accountListData.status.toLowerCase())}
              </span>
            </div>
            {(accountListData.subAccounts._element && accountListData.subAccounts._element.length > 0) ? (
              <div className="sub-account-list-container">
                <SubAccountList getAccountData={this.handleAccount} subAccounts={accountListData.subAccounts} accountName={accountName} registrationNumber={registrationNumber} />
              </div>
            ) : ''}
          </div>
        </div>
      );
    }
}
