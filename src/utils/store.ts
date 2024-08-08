import { type Dayjs } from 'dayjs'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


type DateRangeProps = {
  roomId: string
  hotelId: string
  subRateId: string
  rateCode: string
  startDate: Dayjs | null
  endDate: Dayjs | null
}

type CalendarProps = {
  roomType: string
  totalPeople: number
  roomId: string
  subRateId: string
  quantity: number
  startDate: Dayjs | null
  endDate: Dayjs | null
}

interface CalendarState {
  calendar: CalendarProps
  dateRange: DateRangeProps
  blockDate: DateRangeProps
  priceDialog: boolean
  blockDialog: boolean
  setCalendar: (calendar: CalendarProps) => void
  setDateRange: (dateRange: DateRangeProps) => void
  setPriceDialog: (open: boolean) => void
  setBlockDialog: (open: boolean) => void
  setBlockDate: (blockDate: DateRangeProps) => void
  resetStore: () => void
}

const initialStore = {
  calendar: { totalPeople: 0, roomType: 'none', roomId: 'none', subRateId: 'none', quantity: 0,startDate: null, endDate: null },
  dateRange: { roomId: 'none', hotelId: 'none', rateCode: 'none', subRateId: 'none', startDate: null, endDate: null },
  blockDate: { roomId: 'none', hotelId: 'none', rateCode: 'none', subRateId: "none", startDate: null, endDate: null },
  priceDialog: false,
  blockDialog: false,
}

export const useHotelAdmin = create<CalendarState>()(
  persist(
    (set) => ({
      ...initialStore,
      setCalendar: (calendar) => set((state) => ({ calendar: { ...state.calendar, ...calendar } })),
      setDateRange: (dateRange) => set((state) => ({ dateRange: { ...state.dateRange, ...dateRange } })),
      setBlockDate: (blockDate) => set((state) => ({ blockDate: { ...state.blockDate, ...blockDate } })),
      setPriceDialog: (open) => set({ priceDialog: open }),
      setBlockDialog: (open) => set({ blockDialog: open }),
      resetStore: () => set(initialStore),
    }),
    {
      name: 'MOUNTAIN-VIEW-ADMIN',
    }
  )
)