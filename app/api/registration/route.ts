import { ShopRegistration } from '@/app/types/shops'
import axios from 'axios'
import { verifyAccess } from '@/src/lib/verifyAccess'
import { getBrokerAccessToken } from '@/src/lib/cccBrokerApi'

export const GET = async () => {
    try {
        await verifyAccess({ permission: 'read:registrations' })
    } catch (error) {
        console.error('Access verification failed:', error)
        return new Response(null, { status: 403 })
    }

    try {
        const token = await getBrokerAccessToken()
        const response = await axios.get<ShopRegistration[]>(`${process.env.CCC_BROKER_BASE_URL}/shop`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })

        return Response.json(response.data)
    } catch (error: any) {
        console.error('Error fetching registrations:', error?.response?.data || error.message)
        return new Response(null, { status: 500 })
    }
}
