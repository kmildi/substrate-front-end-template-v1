import React, { createRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
  Card,
} from 'semantic-ui-react'
import 'semantic-ui-less/semantic.less'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'
import bgImage from "/public/assets/qrucial_background.png"

import { AccountSelector, BalanceAnnotation } from './AccountSelector'
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
          <Route exact path='/transfer' element={
            <Container>
              <Card style={{ boxShadow: "0px 1px 3px 1px #0093ff" }}>
                <Card.Content>
                  <Card.Header>Current balance</Card.Header>
                  <BalanceAnnotation />
                </Card.Content>
              </Card>            
              <Container id="transferContainer">
                < Transfer />
              </Container>
            </Container>}>
          </Route>
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
