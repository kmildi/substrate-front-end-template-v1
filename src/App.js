import React, { createRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'
import bgImage from "/public/assets/qrucial_background.png"

import AccountSelector from './AccountSelector'
import Balances from './Balances'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
import Transfer from './Transfer'
import Upgrade from './Upgrade'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

  return (
    <div ref={contextRef}
          className="wrapper" 
          style={{ 
            backgroundImage:`url(${bgImage})`,
            backgroundRepeat:"no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            minHeight: "100%" }}>
      <BrowserRouter>
        <Sticky context={contextRef}>
          <AccountSelector />
        </Sticky>        
        <Routes>
          <Route exact path='/' element={
            <Container>
              <Grid stackable columns="equal">
                <Grid.Row stretched>
                  <NodeInfo />
                  <Metadata />
                  <BlockNumber />
                  <BlockNumber finalized />
                </Grid.Row>
                <Grid.Row stretched>
                  <Balances />
                </Grid.Row>
                <Grid.Row>
                  <Transfer />
                  <Upgrade />
                </Grid.Row>
                <Grid.Row>
                  <Interactor />
                  <Events />
                </Grid.Row>
                <Grid.Row>
                  <TemplateModule />
                </Grid.Row>
              </Grid>
            </Container>
            }></Route>
          <Route exact path='/balances' element={<Container>< Balances /></Container>}></Route>
          <Route exact path='/transfer' element={<Container>< Transfer /></Container>}></Route>
        </Routes>
      </BrowserRouter>
      <DeveloperConsole />
    </div>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}
