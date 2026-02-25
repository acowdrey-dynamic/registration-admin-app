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
    try {
        await axios.patch(`${process.env.CCC_BROKER_BASE_URL}/shop/${registrationKey}`, {
            status: jsonBody.status,
        })

        return Response.json({ success: true })
    } catch (error: any) {
        console.error('Error updating registration status:', JSON.stringify(error?.response?.data || error.message))
        throw new Error('Failed to update registration status')
    }
}
