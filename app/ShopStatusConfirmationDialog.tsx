'use client'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
} from '@mui/material'
import { ShopRegistration, ShopRegistrationStatus } from './types/shops'
import { isNil } from 'lodash'

const ShopStatusConfirmationDialog = ({
    open,
    status,
    shop,
    title,
    text,
    actionText,
    onClose,
    onConfirm,
    loading = false,
}: {
    open: boolean
    status: ShopRegistrationStatus.ACTIVE | ShopRegistrationStatus.INACTIVE
    shop: ShopRegistration | null
    title: string
    text: string
    actionText: string
    onClose: () => void
    onConfirm: ({ registrationKey, newStatus }: { registrationKey: string; newStatus: ShopRegistrationStatus }) => void
    loading?: boolean
}) => {
    const isApprove = status === ShopRegistrationStatus.ACTIVE

    if (isNil(shop)) {
        return null
    }
    return (
        <Dialog open={open} onClose={loading ? undefined : onClose}>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <DialogContentText>{text}</DialogContentText>
                <DialogContentText sx={{ mt: 2 }}>
                    <strong>{shop.shopName}</strong>
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color={isApprove ? 'success' : 'error'}
                    onClick={() => onConfirm({ registrationKey: shop.registrationKey, newStatus: status })}
                    disabled={loading}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : actionText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ShopStatusConfirmationDialog
