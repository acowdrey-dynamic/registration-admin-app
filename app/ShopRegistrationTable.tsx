import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Chip } from '@mui/material'
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
}: {
    shopRegistrations: ShopRegistration[]
    setShopToActivate: (shop: ShopRegistration) => void
    setShopToDeactivate: (shop: ShopRegistration) => void
    updatingKey: string | null
}) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Shop Name</TableCell>
                        <TableCell>License</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Diagnostics</TableCell>
                        <TableCell>Created Date</TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {shopRegistrations.map((reg) => {
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
                                <TableCell align="right">
                                    {canApprove && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            sx={{ mr: 1 }}
                                            disabled={isUpdating}
                                            onClick={() => setShopToActivate(reg)}>
                                            Approve
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell align="left">
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
                    })}

                    {shopRegistrations.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                No registrations found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ShopRegistrationTable
