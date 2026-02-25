export enum ShopRegistrationStatus {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    INACTIVE = 'INACTIVE',
}

export enum DiagnosticsProduct {
    DIAGNOSTICS_WORKFLOW = 'DIAGNOSTICS_WORKFLOW',
}

export interface ShopRegistration {
    registrationKey: string
    cccLicenseNumber: string
    status: ShopRegistrationStatus
    shopName: string
    streetAddress: string
    city: string
    state: string
    zipcode: string
    shopProviderKey?: string
    diagnosticsProducts: DiagnosticsProduct[]
    createdAt: string // ISO format
}
