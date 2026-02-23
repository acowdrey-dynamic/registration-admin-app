'use client'

import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
} from '@mui/material'
import { ShopRegistration, ShopRegistrationStatus } from './types/shops'

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<ShopRegistration[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingKey, setUpdatingKey] = useState<string | null>(null)

    useEffect(() => {
        fetchRegistrations()
    }, [])

    const fetchRegistrations = async () => {
        try {
            const res = await fetch('/api/registrations')
            const data = await res.json()
            console.log(data)
            setRegistrations(data)
        } catch (err) {
            console.error('Failed to fetch registrations', err)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (
        registrationKey: string,
        status: ShopRegistrationStatus,
    ) => {
        // update status here
    }

    const renderStatusChip = (status: ShopRegistrationStatus) => {
        const color =
            status === ShopRegistrationStatus.ACTIVE
                ? 'success'
                : status === ShopRegistrationStatus.PENDING
                  ? 'warning'
                  : 'default'

        return <Chip label={status} color={color} size="small" />
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Shop Registrations
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Shop Name</TableCell>
                            <TableCell>License</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Diagnostics</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {registrations.map((reg) => (
                            <TableRow key={reg.registrationKey}>
                                <TableCell>{reg.shopName}</TableCell>
                                <TableCell>{reg.cccLicenseNumber}</TableCell>
                                <TableCell>
                                    {reg.streetAddress}, {reg.city}, {reg.state}{' '}
                                    {reg.zipcode}
                                </TableCell>
                                <TableCell>
                                    {renderStatusChip(reg.status)}
                                </TableCell>
                                <TableCell>
                                    {reg.diagnosticsProducts.join(', ')}
                                </TableCell>
                                <TableCell align="right">
                                    {reg.status ===
                                        ShopRegistrationStatus.PENDING && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                sx={{ mr: 1 }}
                                                disabled={
                                                    updatingKey ===
                                                    reg.registrationKey
                                                }
                                                onClick={() =>
                                                    updateStatus(
                                                        reg.registrationKey,
                                                        ShopRegistrationStatus.ACTIVE,
                                                    )
                                                }>
                                                Approve
                                            </Button>

                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                disabled={
                                                    updatingKey ===
                                                    reg.registrationKey
                                                }
                                                onClick={() =>
                                                    updateStatus(
                                                        reg.registrationKey,
                                                        ShopRegistrationStatus.INACTIVE,
                                                    )
                                                }>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}

                        {registrations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No registrations found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
