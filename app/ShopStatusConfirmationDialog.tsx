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
    action,
    shop,
    onClose,
    onConfirm,
    loading = false,
}: {
    open: boolean
    action: ShopRegistrationStatus.ACTIVE | ShopRegistrationStatus.INACTIVE
    shop: ShopRegistration | null
    onClose: () => void
    onConfirm: () => void
    loading?: boolean
}) => {
    const isApprove = action === ShopRegistrationStatus.ACTIVE

    if (isNil(shop)) {
        return null
    }
    return (
        <Dialog open={open} onClose={loading ? undefined : onClose}>
            <DialogTitle>{isApprove ? 'Approve Registration' : 'Deny Registration'}</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Are you sure you want to <strong>{isApprove ? 'approve' : 'deny'}</strong> the registration for{' '}
                    <strong>{shop.shopName}</strong>?
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color={isApprove ? 'success' : 'error'}
                    onClick={onConfirm}
                    disabled={loading}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : isApprove ? 'Approve' : 'Deny'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ShopStatusConfirmationDialog
