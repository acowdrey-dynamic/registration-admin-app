import { ShopRegistration } from '@/app/types/shops'
import axios from 'axios'
import { verifyAccess } from '@/src/lib/verifyAccess'
import { getBrokerAccessToken } from '@/src/lib/cccBrokerApi'

export const GET = async (req: Request) => {
    const url = new URL(req.url)
    const params = new URLSearchParams()

    const status = url.searchParams.getAll('status')
    status.forEach((s) => params.append('status', s))

    const page = parseInt(url.searchParams.get('page') || '0', 10)
    const size = parseInt(url.searchParams.get('size') || '25', 10)
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    params.append('page', (page + 1).toString()) // API is 1-indexed
    params.append('size', size.toString())

    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)

    try {
        await verifyAccess({ permission: 'read:registrations' })
    } catch (error) {
        console.error('Access verification failed:', error)
        return new Response(null, { status: 403 })
    }

    try {
        const token = await getBrokerAccessToken()

        // Call broker API with query params
        const response = await axios.get<ShopRegistration[]>(`${process.env.CCC_BROKER_BASE_URL}/shop`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            params,
        })

        return Response.json(response.data)
    } catch (error: any) {
        console.error('Error fetching registrations:', error?.response?.data || error.message)
        return new Response(null, { status: 500 })
    }
}
