'use client'

import React, { useEffect, useState } from 'react'
import { Table, Typography } from 'antd'

const { Title } = Typography

const EventsPage = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    // TODO: Fetch events data from API
    // For now, we'll use dummy data
    setEvents([
      { id: 1, name: 'Event 1', artist: 'Artist 1', date: '2023-06-01', location: 'New York' },
      { id: 2, name: 'Event 2', artist: 'Artist 2', date: '2023-06-15', location: 'Los Angeles' },
    ])
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Artist',
      dataIndex: 'artist',
      key: 'artist',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
  ]

  return (
    <div>
      <Title level={2}>Events</Title>
      <Table dataSource={events} columns={columns} rowKey="id" />
    </div>
  )
}

export default EventsPage