import React, {useState, useEffect, useCallback} from 'react'
import {Card, Stack, Text, Button, Flex, Box, Badge, Spinner} from '@sanity/ui'
import {SearchIcon, DownloadIcon, EditIcon, AddIcon} from '@sanity/icons'
import {useClient} from 'sanity'
import {IntentLink} from 'sanity/router'
import {format} from 'date-fns'
import styled from 'styled-components'

const TableContainer = styled(Card)`
  overflow-x: auto;
  width: 100%;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--card-border-color);
  }

  th {
    background-color: var(--card-bg-color);
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 1;
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: var(--card-muted-fg-color);
    }
  }

  tbody tr {
    &:hover {
      background-color: var(--card-muted-fg-color);
    }
  }
`

const FilterBar = styled(Flex)`
  gap: 12px;
  padding: 16px;
  flex-wrap: wrap;
  align-items: center;
`

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid var(--card-border-color);
  border-radius: 4px;
  background: var(--card-bg-color);
  color: var(--card-fg-color);
  font-size: 14px;
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: var(--card-focus-ring-color);
  }
`

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--card-border-color);
  border-radius: 4px;
  background: var(--card-bg-color);
  color: var(--card-fg-color);
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--card-focus-ring-color);
  }
`

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid var(--card-border-color);
  border-radius: 4px;
  background: var(--card-bg-color);
  color: var(--card-fg-color);
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: var(--card-focus-ring-color);
  }
`

interface Registration {
  _id: string
  paypalTransactionId?: string
  registrationType: string
  clientName: string
  phoneNumber: string
  email: string
  paymentAmount: number
  currency: string
  paymentStatus: string
  registrationDate: string
}

export function SpecialRegistrationsTable() {
  const client = useClient({apiVersion: '2023-05-05'})
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredData, setFilteredData] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortField, setSortField] = useState<keyof Registration>('registrationDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchRegistrations()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [registrations, searchTerm, statusFilter, startDate, endDate, sortField, sortDirection])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const query = `*[_type == "specialRegistration"] | order(registrationDate desc) {
        _id,
        paypalTransactionId,
        registrationType,
        clientName,
        phoneNumber,
        email,
        paymentAmount,
        currency,
        paymentStatus,
        registrationDate
      }`
      const data = await client.fetch(query)
      setRegistrations(data)
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortData = () => {
    let filtered = [...registrations]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (reg) =>
          reg.clientName?.toLowerCase().includes(term) ||
          reg.email?.toLowerCase().includes(term) ||
          reg.phoneNumber?.includes(term) ||
          reg.paypalTransactionId?.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((reg) => reg.paymentStatus === statusFilter)
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter((reg) => new Date(reg.registrationDate) >= new Date(startDate))
    }
    if (endDate) {
      filtered = filtered.filter((reg) => new Date(reg.registrationDate) <= new Date(endDate))
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue === undefined || aValue === null) return 1
      if (bValue === undefined || bValue === null) return -1

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    setFilteredData(filtered)
  }

  const handleSort = (field: keyof Registration) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const exportToCSV = () => {
    const headers = [
      'PayPal Transaction ID',
      'Registration Type',
      'Participant Name',
      'Phone Number',
      'Email Address',
      'Payment Amount',
      'Currency',
      'Payment Status',
      'Registration Date',
    ]

    const csvData = filteredData.map((reg) => [
      reg.paypalTransactionId || 'N/A',
      reg.registrationType,
      reg.clientName,
      reg.phoneNumber,
      reg.email,
      reg.paymentAmount,
      reg.currency,
      reg.paymentStatus,
      format(new Date(reg.registrationDate), 'yyyy-MM-dd HH:mm:ss'),
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `special-registrations-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, 'positive' | 'warning' | 'critical'> = {
      completed: 'positive',
      pending: 'warning',
      failed: 'critical',
    }

    return (
      <Badge tone={statusColors[status.toLowerCase()] || 'default'}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card padding={4}>
        <Flex justify="center" align="center" style={{minHeight: '400px'}}>
          <Spinner />
        </Flex>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <Card>
        <FilterBar>
          <SearchInput
            type="text"
            placeholder="Search by name, email, phone, or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </Select>

          <DateInput
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <DateInput
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <Button
            as="a"
            href="/intent/create/type=specialRegistration"
            icon={AddIcon}
            text="Create New"
            tone="positive"
          />

          <Button
            icon={DownloadIcon}
            text="Export CSV"
            tone="primary"
            onClick={exportToCSV}
          />

          <Text size={1} muted>
            Showing {filteredData.length} of {registrations.length} registrations
          </Text>
        </FilterBar>
      </Card>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th onClick={() => handleSort('paypalTransactionId')}>
                PayPal Transaction ID {sortField === 'paypalTransactionId' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('registrationType')}>
                Registration Type {sortField === 'registrationType' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('clientName')}>
                Participant Name {sortField === 'clientName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('phoneNumber')}>
                Phone Number {sortField === 'phoneNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('email')}>
                Email Address {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('paymentAmount')}>
                Payment Amount {sortField === 'paymentAmount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('currency')}>
                Currency {sortField === 'currency' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('paymentStatus')}>
                Payment Status {sortField === 'paymentStatus' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('registrationDate')}>
                Registration Date {sortField === 'registrationDate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((reg) => (
              <tr key={reg._id}>
                <td>
                  <Text size={1}>{reg.paypalTransactionId || 'N/A'}</Text>
                </td>
                <td>
                  <Badge tone="primary">{reg.registrationType}</Badge>
                </td>
                <td>
                  <Text size={1} weight="medium">
                    {reg.clientName}
                  </Text>
                </td>
                <td>
                  <Text size={1}>{reg.phoneNumber}</Text>
                </td>
                <td>
                  <Text size={1}>{reg.email}</Text>
                </td>
                <td>
                  <Text size={1} weight="medium">
                    {reg.paymentAmount}
                  </Text>
                </td>
                <td>
                  <Text size={1}>{reg.currency}</Text>
                </td>
                <td>{getStatusBadge(reg.paymentStatus)}</td>
                <td>
                  <Text size={1}>
                    {format(new Date(reg.registrationDate), 'MMM dd, yyyy HH:mm')}
                  </Text>
                </td>
                <td>
                  <Button
                    as="a"
                    href={`/intent/edit/id=${reg._id};type=specialRegistration`}
                    icon={EditIcon}
                    mode="ghost"
                    tone="primary"
                    fontSize={1}
                    padding={2}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {filteredData.length === 0 && (
        <Card padding={4}>
          <Flex justify="center" align="center" style={{minHeight: '200px'}}>
            <Text muted>No registrations found matching your filters</Text>
          </Flex>
        </Card>
      )}
    </Stack>
  )
}

