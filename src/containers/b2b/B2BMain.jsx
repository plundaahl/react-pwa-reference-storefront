/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import Modal from 'react-responsive-modal';
import SideMenu from './SideMenu';
import RouteWithSubRoutes from '../../RouteWithSubRoutes';
import AddAssociatesMenu from './AddAssociatesMenu';
import './B2BMain.less';

export default class Dashboard extends React.Component {
  static propTypes = {
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isImportDialogOpen: false,
    };
  }

  handleSpreeadsheetClicked() {
    this.setState({ isImportDialogOpen: true });
  }

  handleImportDialogClose() {
    this.setState({ isImportDialogOpen: false });
  }

  render() {
    const { routes } = this.props;
    const { isImportDialogOpen } = this.state;

    return (
      <div className="b2b-main-component">
        <div className="container">
          <div className="b2b-header">
            <div className="page-title">{intl.get('business-account')}</div>
            <div className="quick-menu">
              <AddAssociatesMenu onSpreeadsheetClicked={() => this.handleSpreeadsheetClicked()} />
            </div>
          </div>
          <div className="b2b-central">
            <div className="b2b-side">
              <SideMenu {...this.props} />
            </div>
            <div className="b2b-content">
              {routes.map(route => (
                <RouteWithSubRoutes key={route.path} {...route} />
              ))}
            </div>
          </div>
        </div>

        <Modal
          open={isImportDialogOpen}
          onClose={() => this.handleImportDialogClose()}
          classNames={{ modal: 'b2b-import-associate-dialog', closeButton: 'b2b-dialog-close-btn' }}
        >
          <div className="dialog-header">{intl.get('import-associates-from-csv')}</div>
          <div className="dialog-content">
            <div className="download-sample">{intl.getHTML('download-sample-csv', { link: '#' })}</div>
            <div className="upload-title">{intl.get('upload-associatess-csv')}</div>
            <div className="chose-btn-container">
              <input className="chose-btn" type="file" />
            </div>
          </div>
          <div className="dialog-footer">
            <button className="cancel" type="button" onClick={() => this.handleImportDialogClose()}>{intl.get('cancel')}</button>
            <button className="upload" type="button">{intl.get('upload')}</button>
          </div>
        </Modal>

      </div>
    );
  }
}