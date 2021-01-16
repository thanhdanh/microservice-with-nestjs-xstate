import React from 'react'

const UserMachineContext = React.createContext()

export const UserMachineContextProvider = UserMachineContext.Provider
export const UserMachineContextConsumer = UserMachineContext.Consumer

export default UserMachineContext