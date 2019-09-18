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
import OrderTableLineItem from '../OrderTableLineItem/ordertable.lineitem';
import './ordertable.main.less';

interface OrderTableMainProps {
    data: {
        [key: string]: any
    },
    itemDetailLink?: string,
}

const OrderTableMain: React.FunctionComponent<OrderTableMainProps> = (props: OrderTableMainProps) => {
  const { data, itemDetailLink } = props;
  return (
    <div className="order-main-inner table-responsive">
      <table className="table table-borderless order-table">
        <tbody>
          {data.lineitems.elements.map(product => (
            <OrderTableLineItem key={product.item.code.code} item={product} itemDetailLink={itemDetailLink} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

OrderTableMain.defaultProps = {
  itemDetailLink: '',
};

export default OrderTableMain;
