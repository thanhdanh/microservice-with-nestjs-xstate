import React from 'react'

const MachineContext = React.createContext()

export const MachineContextProvider = MachineContext.Provider
export const MachineContextConsumer = MachineContext.Consumer

export default MachineContext