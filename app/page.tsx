'use client'
import { useUser } from '@auth0/nextjs-auth0'
import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { ShopRegistration, ShopRegistrationStatus } from './types/shops'
import { useRouter } from 'next/navigation'
import ShopStatusConfirmationDialog from './ShopStatusConfirmationDialog'
import { isEmpty } from 'lodash'
import { loginRoute, logoutRoute } from '@/proxyRoutes'
import axios from 'axios'
import ToolBar from './ToolBar'
import ShopRegistrationTable from './ShopRegistrationTable'

export default function RegistrationPage() {
    const [registrations, setRegistrations] = useState<ShopRegistration[]>([])
    const [loading, setLoading] = useState(true)
    const [shopToActivate, setShopToActivate] = useState<ShopRegistration | null>(null)
    const [shopToDeactivate, setShopToDeactivate] = useState<ShopRegistration | null>(null)
    const [updatingKey, setUpdatingKey] = useState<string | null>(null)
    const router = useRouter()

    const { isLoading, user } = useUser()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(loginRoute)
        }
    }, [isLoading, user, router])

    useEffect(() => {
        fetchRegistrations()
    }, [])

    const fetchRegistrations = async () => {
        try {
            const response = await axios.get<ShopRegistration[]>('/api/registration')
            setRegistrations(response.data)
        } catch (err) {
            console.error('Failed to fetch registrations', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading || isLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        )
    }

    if (!user) {
        return null
    }

    const hasShopToActivate = !isEmpty(shopToActivate)
    const hasShopToDeactivate = !isEmpty(shopToDeactivate) && !hasShopToActivate // prevent both from being true

    const updateStatus = async ({
        registrationKey,
        newStatus,
    }: {
        registrationKey: string
        newStatus: ShopRegistrationStatus
    }) => {
        setUpdatingKey(registrationKey)
        try {
            await axios.post<ShopRegistration[]>(`/api/registration/${registrationKey}/status`, { status: newStatus })
        } finally {
            setUpdatingKey(null)
            setShopToActivate(null)
            setShopToDeactivate(null)
            fetchRegistrations()
        }
    }

    return (
        <>
            <ToolBar onLogout={() => router.push(logoutRoute)} />
            <Box p={4}>
                <ShopStatusConfirmationDialog
                    open={hasShopToActivate}
                    status={ShopRegistrationStatus.ACTIVE}
                    shop={shopToActivate}
                    onClose={() => setShopToActivate(null)}
                    onConfirm={updateStatus}
                    loading={loading}
                />
                <ShopStatusConfirmationDialog
                    open={hasShopToDeactivate}
                    status={ShopRegistrationStatus.INACTIVE}
                    shop={shopToDeactivate}
                    onClose={() => setShopToDeactivate(null)}
                    onConfirm={updateStatus}
                    loading={loading}
                />

                <ShopRegistrationTable
                    shopRegistrations={registrations}
                    setShopToActivate={setShopToActivate}
                    setShopToDeactivate={setShopToDeactivate}
                    updatingKey={updatingKey}
                />
            </Box>
        </>
    )
}
