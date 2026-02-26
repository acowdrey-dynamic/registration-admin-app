import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Chip,
    TablePagination,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
    Box,
    TextField,
} from '@mui/material'
import { isEmpty } from 'lodash'
import { ShopRegistration, ShopRegistrationStatus } from './types/shops'

const renderStatusChip = (status: ShopRegistrationStatus) => {
    const color =
        status === ShopRegistrationStatus.ACTIVE
            ? 'success'
            : status === ShopRegistrationStatus.PENDING
              ? 'warning'
              : 'default'

    return <Chip label={status} color={color} size="small" />
}

const ShopRegistrationTable = ({
    shopRegistrations,
    setShopToActivate,
    setShopToDeactivate,
    updatingKey,
    filterStatus,
    setFilterStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalCount,
    loading,
}: {
    shopRegistrations: ShopRegistration[]
    setShopToActivate: (shop: ShopRegistration) => void
    setShopToDeactivate: (shop: ShopRegistration) => void
    updatingKey: string | null
    filterStatus: ShopRegistrationStatus | 'ALL'
    setFilterStatus: (status: ShopRegistrationStatus | 'ALL') => void
    startDate: string | null
    endDate: string | null
    setStartDate: (date: string | null) => void
    setEndDate: (date: string | null) => void
    page: number
    setPage: (page: number) => void
    rowsPerPage: number
    setRowsPerPage: (size: number) => void
    totalCount: number
    loading: boolean
}) => {
    return (
        <Paper>
            <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
                <FormControl size="small" variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filterStatus || 'ALL'}
                        onChange={(e) => {
                            setFilterStatus(e.target.value as ShopRegistrationStatus | 'ALL')
                            setPage(0)
                        }}
                        label="Status"
                        style={{ minWidth: 120 }}>
                        <MenuItem value={'ALL'}>All</MenuItem>
                        <MenuItem value={ShopRegistrationStatus.PENDING}>Pending</MenuItem>
                        <MenuItem value={ShopRegistrationStatus.ACTIVE}>Active</MenuItem>
                        <MenuItem value={ShopRegistrationStatus.INACTIVE}>Inactive</MenuItem>
                    </Select>
                </FormControl>

                {/* Start Date */}
                <TextField
                    label="From"
                    type="date"
                    size="small"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    value={startDate ?? ''}
                    onChange={(e) => {
                        setStartDate(e.target.value || null)
                        setPage(0)
                    }}
                />

                {/* End Date */}
                <TextField
                    label="To"
                    type="date"
                    size="small"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    value={endDate ?? ''}
                    onChange={(e) => {
                        setEndDate(e.target.value || null)
                        setPage(0)
                    }}
                />
            </div>

            <Box sx={{ position: 'relative' }}>
                <TableContainer
                    sx={{
                        opacity: loading ? 0.5 : 1,
                        pointerEvents: loading ? 'none' : 'auto',
                        transition: 'opacity 0.2s ease-in-out',
                    }}>
                    <Table
                        sx={{
                            tableLayout: 'fixed',
                            width: '100%',
                        }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '18%' }}>Shop Name</TableCell>
                                <TableCell sx={{ width: '10%' }}>License</TableCell>
                                <TableCell sx={{ width: '22%' }}>Address</TableCell>
                                <TableCell sx={{ width: '10%' }}>Status</TableCell>
                                <TableCell sx={{ width: '15%' }}>Diagnostics</TableCell>
                                <TableCell sx={{ width: '12%' }}>Created Date</TableCell>
                                <TableCell sx={{ width: 90 }} align="right" />
                                <TableCell sx={{ width: 90 }} align="left" />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shopRegistrations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No registrations found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                shopRegistrations.map((reg) => {
                                    const isPending = reg.status === ShopRegistrationStatus.PENDING
                                    const isActive = reg.status === ShopRegistrationStatus.ACTIVE
                                    const isUpdating = !isEmpty(updatingKey)
                                    const canApprove = isPending
                                    const canReject = isPending || isActive
                                    return (
                                        <TableRow key={reg.registrationKey}>
                                            <TableCell>{reg.shopName}</TableCell>
                                            <TableCell>{reg.cccLicenseNumber}</TableCell>
                                            <TableCell>
                                                {reg.streetAddress}, {reg.city}, {reg.state} {reg.zipcode}
                                            </TableCell>
                                            <TableCell>{renderStatusChip(reg.status)}</TableCell>
                                            <TableCell>{reg.diagnosticsProducts.join(', ')}</TableCell>
                                            <TableCell>{new Date(reg.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell align="left" padding="checkbox">
                                                {canApprove && (
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        sx={{ m: 0 }}
                                                        disabled={isUpdating}
                                                        onClick={() => setShopToActivate(reg)}>
                                                        Approve
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell align="left" padding="checkbox">
                                                {canReject && (
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        disabled={isUpdating}
                                                        onClick={() => setShopToDeactivate(reg)}>
                                                        Deny
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                            {shopRegistrations.length < rowsPerPage && // Add empty rows to maintain consistent height
                                Array.from({ length: rowsPerPage - shopRegistrations.length }).map((_, i) => (
                                    <TableRow key={`empty-${i}`} sx={{ height: 57 }}>
                                        <TableCell colSpan={8} />
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {loading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(2px)',
                        }}>
                        <CircularProgress size={40} />
                    </Box>
                )}
            </Box>

            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10))
                    setPage(0)
                }}
                rowsPerPageOptions={[5, 10]}
            />
        </Paper>
    )
}

export default ShopRegistrationTable
