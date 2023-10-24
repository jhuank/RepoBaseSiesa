export class User {
    avatar?: string;
    isLogged?: boolean;
    isOwner?: boolean;
    userId?: string;
    username?: string;
    firstname?: string;
    fullname?: string;
    city?: string;
    phoneCode?: number;
    mobile?: string;
    phone?: string;
    thirdName?: string;
    operatingCenter?: string;
    operatingCenterId?: string;
    contactName?: string;
    contactFirstName?: string;
    contactLastName?: string;
    contactEmail?: string;
    contactPosition?: number;
    paymentMethod?: boolean;
    isSeller?: boolean;
    isNatural?: boolean;
    isMaster?: boolean;
    isProvider?: boolean;
    isContactCenter?: boolean;
    isSupervisor?: boolean;
    applyLogisticsService?: boolean;
    // isB2B?: boolean; // @FIXME?: deprecated
    seller?: {
        nombre?: string;
        sucursal?: string;
        telefono?: string;
        movil?: string;
        email?: string;
    };
    sellerId?: string;
    sellerExt?: number;
    operatingCenters?: object;
    thirdId?: number;
    thirdDocumentTypeId?: number;
    thirdDocumentTypeName?: string;
    thirdDocumentNumber?: string;
    thirdDocumentDV?: string;
    thirdAttendantTypeId?: number;
    thirdAttendantTypeName?: string;
    isB2B?: boolean;
    token?: string;
    favoriteItems: string[];
}
