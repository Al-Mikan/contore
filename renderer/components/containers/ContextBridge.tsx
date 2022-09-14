import React, { ReactNode } from 'react'

interface ContextBridgeProps {
  children: ReactNode
  Context: React.Context<any>
  render: (children: JSX.Element) => JSX.Element
}

const ContextBridge = ({ children, Context, render }: ContextBridgeProps) => {
  return (
    <Context.Consumer>
      {(value) =>
        render(<Context.Provider value={value}>{children}</Context.Provider>)
      }
    </Context.Consumer>
  )
}

export default ContextBridge
