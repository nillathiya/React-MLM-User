import React from 'react'
import MasterLayout from '../../masterLayout/MasterLayout'

import ChatMessageLayer from '../Supports/ChatMessageLayer'
import ChatMessagePage from '../ChatMessagePage'
import Breadcrumb from '../../components/Breadcrumb'


const Support = () => {
  return (
    <MasterLayout>
      <Breadcrumb PageHeading="Chart" title="Chat Message" />
        <ChatMessageLayer/>
    </MasterLayout>
  )
}

export default Support
