import {
    DiagnosticsProduct,
    ShopRegistration,
    ShopRegistrationStatus,
} from '@/app/types/shops'
import axios from 'axios'

export const mockRegistrations: ShopRegistration[] = [
    {
        registrationKey: 'REG-1001',
        cccLicenseNumber: 'CCC-123456',
        status: ShopRegistrationStatus.ACTIVE,
        shopName: 'Precision Auto Repair',
        streetAddress: '123 Main St',
        city: 'Kansas City',
        state: 'MO',
        zipcode: 64108,
        shopProviderKey: 'PROV-001',
        diagnosticsProducts: [DiagnosticsProduct.DIAGNOSTICS_WORKFLOW],
    },
    {
        registrationKey: 'REG-1002',
        cccLicenseNumber: 'CCC-654321',
        status: ShopRegistrationStatus.PENDING,
        shopName: 'Elite Collision Center',
        streetAddress: '456 Oak Ave',
        city: 'Overland Park',
        state: 'KS',
        zipcode: 66210,
        diagnosticsProducts: [],
    },
    {
        registrationKey: 'REG-1003',
        cccLicenseNumber: 'CCC-111222',
        status: ShopRegistrationStatus.INACTIVE,
        shopName: 'Metro Body Shop',
        streetAddress: '789 Pine Rd',
        city: 'Olathe',
        state: 'KS',
        zipcode: 66061,
        shopProviderKey: 'PROV-002',
        diagnosticsProducts: [DiagnosticsProduct.DIAGNOSTICS_WORKFLOW],
    },
]

export const GET = async (request: Request) => {
    return Response.json(mockRegistrations)
    try {
        const response = await axios.get<ShopRegistration[]>(
            `${process.env.API_BASE_URL}/registrations`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )

        return Response.json(response.data)
    } catch (error: any) {
        console.error(
            'Error fetching registrations:',
            error?.response?.data || error.message,
        )
        throw new Error('Failed to fetch registrations')
    }
}
