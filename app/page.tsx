'use client'
import { useUser } from '@auth0/nextjs-auth0'
import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { ShopRegistration, ShopRegistrationStatus } from './types/shops'
import { useRouter } from 'next/navigation'
import ShopStatusConfirmationDialog from './ShopStatusConfirmationDialog'
import { isEmpty, set } from 'lodash'
import { loginRoute, logoutRoute } from '@/proxyRoutes'
import axios from 'axios'
import ToolBar from './ToolBar'
import ShopRegistrationTable from './ShopRegistrationTable'

export default function RegistrationPage() {
    // Table Filters and Pagination
    const [page, setPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [filterStatus, setFilterStatus] = useState<ShopRegistrationStatus | 'ALL'>('ALL')
    const [registrations, setRegistrations] = useState<ShopRegistration[]>([])
    const [startDate, setStartDate] = useState<string | null>(null)
    const [endDate, setEndDate] = useState<string | null>(null)

    const [loadingData, setLoadingData] = useState(true)
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
    }, [page, rowsPerPage, filterStatus, startDate, endDate])

    const fetchRegistrations = async () => {
        setLoadingData(true)
        try {
            const response = await axios.get<{
                data: ShopRegistration[]
                pagination: {
                    totalCount: number
                    currentPage: number
                    pageSize: number
                }
            }>('/api/registration', {
                params: {
                    page: page,
                    size: rowsPerPage,
                    ...(filterStatus && filterStatus !== 'ALL' ? { status: filterStatus } : {}),
                    ...(startDate ? { startDate } : {}),
                    ...(endDate ? { endDate } : {}),
                },
            })
            setTotalCount(response.data.pagination.totalCount)
            setRegistrations(response.data.data)
            setPage(response.data.pagination.currentPage - 1) // API is 1-indexed
            console.log({ response })
        } catch (err) {
            console.error('Failed to fetch registrations', err)
        } finally {
            setLoadingData(false)
        }
    }

    if (isLoading) {
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
            await axios.post<any, any, { status: ShopRegistrationStatus }>(
                `/api/registration/${registrationKey}/status`,
                { status: newStatus },
            )
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
                    loading={loadingData}
                />
                <ShopStatusConfirmationDialog
                    open={hasShopToDeactivate}
                    status={ShopRegistrationStatus.INACTIVE}
                    shop={shopToDeactivate}
                    onClose={() => setShopToDeactivate(null)}
                    onConfirm={updateStatus}
                    loading={loadingData}
                />

                <ShopRegistrationTable
                    shopRegistrations={registrations}
                    setShopToActivate={setShopToActivate}
                    setShopToDeactivate={setShopToDeactivate}
                    updatingKey={updatingKey}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    page={page}
                    setPage={setPage}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    totalCount={totalCount}
                    loading={loadingData}
                />
            </Box>
        </>
    )
}
