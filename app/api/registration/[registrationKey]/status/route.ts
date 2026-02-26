import { ShopRegistrationStatus } from '@/app/types/shops'
import { getBrokerAccessToken } from '@/src/lib/cccBrokerApi'
import { verifyAccess } from '@/src/lib/verifyAccess'
import axios from 'axios'
import { NextRequest } from 'next/server'

export const POST = async (request: NextRequest, { params }: { params: Promise<{ registrationKey: string }> }) => {
    const { registrationKey } = await params
    const body = request.body

    if (body === null) {
        return Response.json({ success: false, message: 'Request body is required' }, { status: 400 })
    }
    const parsedBody = await body.getReader().read()
    const decodedBody = new TextDecoder().decode(parsedBody.value)
    const jsonBody = JSON.parse(decodedBody)
    const status = jsonBody?.status as ShopRegistrationStatus.ACTIVE | ShopRegistrationStatus.INACTIVE | undefined

    if (!status) {
        return Response.json({ success: false, message: 'Status is required' }, { status: 400 })
    }

    try {
        switch (status) {
            case ShopRegistrationStatus.ACTIVE:
                await verifyAccess({ permission: 'approve:registrations' })
                break
            case ShopRegistrationStatus.INACTIVE:
                await verifyAccess({ permission: 'deny:registrations' })
                break
            default:
                return Response.json({ success: false, message: 'Invalid status value' }, { status: 400 })
        }
    } catch (error) {
        console.error('Access verification failed:', error)
        return new Response(null, { status: 403 })
    }

    try {
        const token = await getBrokerAccessToken()
        await axios.patch(
            `${process.env.CCC_BROKER_BASE_URL}/shop/${registrationKey}`,
            {
                status,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )

        return Response.json({ success: true })
    } catch (error: any) {
        console.error('Error updating registration status:', JSON.stringify(error?.response?.data || error.message))
        throw new Error('Failed to update registration status')
    }
}
