import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';
import cartData from './MockHttpResponses/cart_data_response';

import CartMain from './cart.main';

function handleQuantityChange(){}
storiesOf('CartMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('CartMain', () => {
    return (
        <CartMain
            empty={false}
            cartData={cartData._defaultcart[0]}
            handleQuantityChange={handleQuantityChange}
        />
      );
  });