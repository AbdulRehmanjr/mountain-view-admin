
type RoomProps = {
    roomId: string
    roomName: string
    capacity: number
    area: number
    beds: number
    features: string[]
    pictures: string[]
    quantity:number
    dp: string
    hotelHotelId: string
    description: string
    roomType: string
}
type RoomDetailProps = {
    roomId: string
    roomName: string
    capacity: number
    area: number
    beds: number
    features: string[]
    pictures: string[]
    dp: string
    quantity:number
    hotelHotelId: string
    description: string
    roomType: string
    hotel: {
        hotelId: string
        hotelName: string
        location: string
        manager: string
        createdAt: Date
        sellerInfoSellerId: string
        island: string
    }
}

type PriceProps = {
    priceId: string
    startDate: string
    endDate: string
    price: number
    roomType: string
    roomId:string
    percentInc: number
}

type BookingProps = {

    bookingId: string
    startDate: string
    endDate: string
    price: string
    status: boolean
    isRefund: boolean
    paymentEmail: string
    captureId: string
    payerId: string
    paymentId: string
    roomRoomId: string
    bookingDetailId: string
}

type BookingInfoProps = {
    bookingDetailId: string
    adults: number
    children: number
    kids: number
    city: string
    country: string
    phone: string
    postalCode: string
    streetName: string
    fullName: string
    surName: string
    email: string
    arrivalTime: string
}

type BookingDetailProps = {
    bookingId: string
    startDate: string
    endDate: string
    price: string
    status: boolean
    isRefund: boolean
    paymentEmail: string
    captureId: string
    payerId: string
    paymentId: string
    roomRoomId: string
    bookingDetailId: string
    bookingDetails: {
        bookingDetailId: string
        adults: number
        children: number
        kids: number
        city: string
        country: string
        phone: string
        postalCode: string
        streetName: string
        fullName: string
        surName: string
        email: string
        arrivalTime: string
    }
    Room: {
        roomId: string
        roomName: string
        capacity: number
        area: number
        bed: number
        features: string[]
        pictures: string[]
        dp: string
        hotelHotelId: string
        description: string
        price: string

        roomType: string
    }
}

type HotelProps = {
    hotelId: string
    hotelName: string
    location: string
    manager: string
    createdAt: Date
    sellerInfoSellerId: string
    island: string
}

type StatusProps = {
    primaryEmail: boolean
    amountReceivable: boolean
}

type GoogleTokenProp = {
    cg_access_token: string
    cg_refresh_token: string
    cg_scope: string
    cg_token_type: string
    cg_expiry_date: number | string
}

type MyRentInfoProps = {
    myRentId: string
    propertyId: string
    userId: string
    erpId: string
    roomRoomId: string
}

type MyRentInfoDetailProps = {
    myRentId: string
    propertyId: string
    userId: string
    erpId: string
    roomRoomId: string
    room: {
        roomId: string
        roomName: string
        capacity: number
        area: number
        bed: number
        features: string[]
        pictures: string[]
        dp: string
        hotelHotelId: string
        description: string
        price: string

        roomType: string
    }
}

type BlockDateProps = {
    blockId: string
    dates: string[]
    roomRoomId: string
}

type DiscountProps = {
    discountId: string
    discount: number
    title: string
    redeemCode: string
}

type MyRentGroupProps = {
    id: string
    groupId: number
    groupName: string
}

