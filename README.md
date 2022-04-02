## Description

Proxy implementation example (RestAPI => Apollo GQL) and SSR frontend (next + materialui v5)
This is not a fully completed project. It is kit of components, factories and proxy system.

## Authorization

Authorization via Bearer token on the rest server is converted into cookies in the proxy.
The token is renewed automatically upon expiration.

## Forms

A [small system](./src/components/core/Form.jsx) for managing the state of forms through the context has been implemented. 
This is potentially a very flexible option for filling and validating complex forms. 

## Factories

Samples of some factories located [here](./src/components/utils/formFactories.js). It allows you to reduce boilerplate code in similar situations.

## Theme

The light and dark theme switching provided with MUI is implemented using cookies so that SSR correctly handles the current requested application state.
