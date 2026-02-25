import { ShopRegistration } from '@/app/types/shops'
import axios from 'axios'

export const GET = async () => {
    try {
        const response = await axios.get<ShopRegistration[]>(`${process.env.CCC_BROKER_BASE_URL}/shop`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return Response.json(response.data)
    } catch (error: any) {
        console.error('Error fetching registrations:', error?.response?.data || error.message)
        throw new Error('Failed to fetch registrations')
    }
}
