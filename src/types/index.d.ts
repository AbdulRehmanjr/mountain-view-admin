type RoomProps = {
    roomId: string
    roomName: string
    capacity: number
    area: number
    beds: number
    features: string[]
    pictures: string[]
    quantity: number
    dp: string
    hotelHotelId: string
    description: string
    roomType: string
}
type RoomDetailProps = {
    roomId: string
    roomName: string
    capacity: number
    code: string
    area: number
    beds: number
    features: string[]
    pictures: string[]
    dp: string
    quantity: number
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

type RoomTableProps = {
    roomId: string
    roomName: string
    capacity: number
    area: number
    beds: number
    features: string[]
    pictures: string[]
    dp: string
    quantity: number
    hotelHotelId: string
    description: string
    roomType: string
    hotel: {
        hotelName: string;
        hotelId: string;
        island: string
        phone: string
        sellerInfoSellerId: string;
    };
}

type PriceProps = {
    priceId: string
    startDate: string
    endDate: string
    planCode: string
    price: number
    rrpId: string
}

type RatePriceProps = {
    rrpId: string
    rateId: string
    roomId: string
    quantity: number
    hotelName: string
    hotelId: string
    RoomPrice: {
        startDate: string
        endDate: string
        price: number
        planCode: string
    }[]
    room: {
        roomId: string
        roomName: string
        quantity: number
    }
    rate: {
        ratePlanId: string,
        name: string,
        code: string,
    }
}

type GroupedRatePriceProps = {
    roomId: string
    roomName: string
    quantity: number
    rates: {
        rrpId: string
        rateId: string
        roomId: string
        quantity: number
        hotelName: string
        hotelId: string
        RoomPrice: {
            startDate: string
            endDate: string
            price: number
            planCode: string
        }[]
        rate: {
            ratePlanId: string,
            name: string,
            code: string,
        }
    }[]
}

type FilteredPricesProps = {
    rrpId: string;
    rateId: string;
    roomId: string;
    quantity: number;
    hotelName: string;
    hotelId: string;
    RoomPrice: {
        startDate: string;
        endDate: string;
        price: number;
        planCode: string;
    }[];
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
    quantity:number
    city: string
    country: string
    phone: string
    postalCode: string
    address: string
    fullName: string
    surName: string
    email: string
    arrivalTime: string
}

type BookingDetailProps = {
    bookingId: string
    startDate: string
    endDate: string
    price: number
    isRefund: boolean
    type:string
    payPalInfoId: string
    roomRoomId: string
    bookingDetailId: string
    bookingDetails: {
        bookingDetailId: string
        adults: number
        children: number
        kids: number
        quantity: number
        city: string
        country: string
        phone: string
        postalCode: string
        address: string
        fullName: string
        surName: string
        email: string
        arrivalTime: string
    }
    Room: {
        roomId: string
        roomName: string
        hotelHotelId: string
        roomType: string
        hotel: {
            hotelName: string
            island: string
            phone: string
        }
    }
    PayPalBoookingInfo: {
        paypalBoookingId: string
        paymentId: string
    }
}

type HotelProps = {
    hotelId: string
    hotelName: string
    type: number
    island: string
    address: string
    longitude: number
    latitude: number
    description: string
    firstName: string
    lastName: string
    email: string
    phone: string
    checkIn: string
    checkOut: string
    code: string
    createdAt: Date
    sellerInfoSellerId: string
}


type RatePlanProps = {
    ratePlanId: string
    code: string
    name: string
    description: string
    mealId: number
    hotelHotelId: string
}

type RatePlanDetailProps = {
    ratePlanId: string
    code: string
    name: string
    description: string
    mealId: number
    hotelHotelId: string
    hotelId: {
        hotelId: string
        code: string
        hotelName: string
        sellerInfoSellerId: string
    }
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
    startDate: string,
    endDate: string,
    createdAt: Date
    redeemCode: string
}

type MyRentGroupProps = {
    id: string
    groupId: number
    groupName: string
}

type ResultEntry = {
    roomId: string;
    roomName: string;
    quantity: number
    hotelName: string;
    hotelId: string;
    ratePlans: {
        planCode: string;
        planName: string;
        prices: {
            date: string;
            price: number;
        }[];
    }[];
};