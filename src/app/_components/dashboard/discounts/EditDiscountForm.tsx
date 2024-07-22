'use client'

import { ReloadIcon } from "@radix-ui/react-icons"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { useToast } from "~/components/ui/use-toast"
import { api } from "~/trpc/react"

type FormProps = {
    title: string
    discount: string
}

export const EditDiscountForm = ({ discountId }: { discountId: string }) => {

    const toast = useToast()
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormProps>()
    const discount = api.discount.getDiscountById.useQuery({ discountId: discountId })
    const createDiscount = api.discount.updateDiscount.useMutation({
        onSuccess: async () => {
            toast.toast({
                title: "Data modified",
                description: "Discount information has been modified",
            })
            await discount.refetch()
        }
    })

    useEffect(() => {
        if (discount.data) {
            setValue('title', discount.data.title)
            setValue('discount', discount.data.discount + "")
        }
    }, [discount.data, setValue])

    const formSubmitted = (values: FormProps) => {
        createDiscount.mutate({ discountId: discountId, title: values.title, discount: +values.discount })
    }

    return (
        <>
            <form onSubmit={handleSubmit(formSubmitted)} className="flex flex-col gap-3 ">
                <div className="flex flex-col gap-1">
                    <label className="font-bold">Discount title</label>
                    <input className="border-2 border-gray-900 rounded-md p-2" {...register('title', { required: "Field is Required." })} type="text" placeholder="Enter the title" />
                    {errors.title?.message && (
                        <small className="text-red-600">{errors.title.message}</small>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-bold">Discount percentage</label>
                    <input className="border-2 border-gray-900 rounded-md p-2" {...register('discount', { required: "Field is Required." })} type="number" placeholder="Enter the title" />
                    {errors.discount?.message && (
                        <small className="text-red-600">{errors.discount.message}</small>
                    )}
                </div>
                <div className="flex justify-center">
                    <Button type="submit" disabled={createDiscount.isLoading}>
                        {
                            createDiscount.isLoading ? <> <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Updating</> : 'Update'
                        }
                    </Button>
                </div>
            </form>
        </>
    )
}