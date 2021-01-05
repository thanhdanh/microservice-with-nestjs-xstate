# setel

Project is Order Management, it is using NestJS and applying Microservice. This repository is also include a SPA, written by ReactJS.

## Features

+ User can make an new order
+ New order must trigger a payment process by sending request to payment app. After that, rely the response of payment app, new order can be updated its status.
+ User can check order status
+ After X amount of seconds confirmed orders will automatically be moved to the delivered state.

## Architecture

This project consists of the following parts:
+ API gateway.
+ Order Service
+ Payment Service