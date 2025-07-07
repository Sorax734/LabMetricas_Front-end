import { addToast, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, Form, Input, InputOtp, Select, SelectItem, useDisclosure } from "@heroui/react"
import { CloseButton } from "../CloseButton"
import { ArrowHookUpRightFilled, CheckmarkFilled, ChevronDownFilled, DismissCircleFilled, DismissFilled, PersonAvailableFilled, PersonSubtractFilled, TextAsteriskFilled } from "@fluentui/react-icons"
import { useEffect, useState } from "react"
import { noSpaces, onlyLetters, required, validEmail, } from "../../validators/validators"
import { SecondaryButton } from "../SecondaryButton"
import { getCustomers } from "../../service/customer"
import { CustomersModal } from "./CustomersModal"
import { CustomersChangeStatusModal } from "./CustomersChangeStatusModal"

export const CustomersDrawer = ({isOpen, onOpenChange, data, action, onRefresh}) => {
    const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure()
    const {isOpen: isModalCSOpen, onOpen: onModalCSOpen, onOpenChange: onModalCSOpenChange} = useDisclosure()
    
    const [isLoading, setIsLoading] = useState(false)

    const [customer, setCustomer] = useState({
        id: data?.id || "",
        name: data?.name || "",
        email: data?.email || "",
        nif: data?.nif || "",
    })

    const [customerErrors, setCustomerErrors] = useState({ 
        name: [],
        email: [],
        nif: [],
    })

    useEffect(() => {
        setCustomer({
            id: data?.id || "",
            name: data?.name || "",
            email: data?.email || "",
            nif: data?.nif || "",
        })

        setCustomerErrors({
            name: [],
            email: [],
            nif: [],
        })
    }, [data]);

    const resetForm = () => {
        setCustomer({ id:"", name:"", email:"", nif:"" })
        setCustomerErrors({ name:[], email:[], nif:[] })
    }

    const validators = {
        name: [required, onlyLetters],
        email: [validEmail],
        nif: [required, noSpaces],
    }

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const handleInputChange = (field, value) => {
        setCustomer(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setCustomerErrors(prev => ({ ...prev, [field]: errs }))
    }

    let title
    let description

    switch (action) {
        case "create":
            title = "Registrar cliente"
            description = "Ingrese la información solicitada para poder registrar un nuevo cliente."
            break
        case "update":
            title = "Actualizar cliente"
            description = "Edite la información necesaria y guarde los cambios para actualizar el cliente."
            break
        default:
            title = "Detalles del cliente"
            description = "Revise la información completa del cliente. Esta vista es solo de lectura."
            break
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))
        
        const formData = action !== "create"
            ? { id: customer.id, ...formEntries }
            : { ...formEntries };

        try {
            setIsLoading(true)

            const response = await getCustomers()
            const customers = response.data

            const exists = customers.find(u => u.email.toLowerCase() === formData.email.toLowerCase())
            const existsNIF = customers.find(u => u.nif.toLowerCase()   === formData.nif.toLowerCase())

            const newErrors = { name: [], email: [], nif: [] };

            if (action === "create") {
                if (exists) newErrors.email.push("El correo electrónico ingresado ya está en uso.");
                if (existsNIF) newErrors.nif.push("El NIF ingresado ya está en uso.");
            }

            if (action === "update") {
                if (exists && exists.id !== formData.id) newErrors.email.push("El correo electrónico ingresado ya está en uso.")
                if (existsNIF && existsNIF.id !== formData.id) newErrors.nif.push("El NIF ingresado ya está en uso.")
            }

            if (newErrors.email.length > 0 || newErrors.nif.length > 0) {
                setCustomerErrors(newErrors)

                addToast({
                    title: "Algunos datos ingresados no son correctos",
                    description: "Por favor, verifica que sean válidos",
                    color: "danger",
                    icon: <DismissCircleFilled className="size-5"/>
                })

                return
            }
        } catch (error) {
        console.log(error)
            addToast({
                title: `No se pudo verificar el correo ni el nif. Intenta de nuevo.`,
                description: error.response.data.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
            return
        } finally {
            setIsLoading(false)
        }

        setCustomerErrors({ name: [], email: [], nif: [] });
        setCustomer(formData)
        onModalOpen()
    }

    return (
        <>
            <Drawer
                hideCloseButton
                size="sm"
                radius="sm"
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                classNames={{wrapper: "!h-[100dvh]", backdrop: "bg-black/30"}}
                motionProps={{ 
                    variants: {
                        enter: {
                            x: 0,
                            opacity: 1,
                            transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }
                        },
                        exit: {
                            x: 100,
                            opacity: 0,
                            transition: {
                                duration: 0.3,
                                ease: "easeIn"
                            }
                        }
                    }
                }}
            >
                <DrawerContent className="bg-background">
                    {(onClose) => (
                        <>
                        <DrawerHeader className="flex flex-col gap-2 pb-8">
                            <div className="w-full flex justify-between pt-4 pb-2">
                                <p className="text-lg font-bold">{title}</p>
                                <CloseButton onPress={onClose}/>     
                            </div>
                            <p className="text-sm font-normal">{description}</p>
                        </DrawerHeader>
                        <DrawerBody className="h-full flex flex-col justify-between [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary">
                            <Form onSubmit={onSubmit} id="customer-form" className="gap-6 flex flex-col">
                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Nombre</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{customer.name.length + " / 100"}</p>
                                        </div>
                                    }
                                    autoComplete="given-name"
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="name"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={100}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el nombre del cliente" : data.name}
                                    value={customer.name}
                                    onValueChange={(value) => handleInputChange('name', value)}
                                    isInvalid={customerErrors.name.length > 0}
                                    endContent={customerErrors.name.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {customerErrors.name.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Correo electrónico</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{customer.email.length + " / 50"}</p>
                                        </div>
                                    }
                                    autoComplete="email"
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="email"
                                    labelPlacement="outside"
                                    type="email"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={50}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el correo electrónico del cliente" : data.email}
                                    value={customer.email}
                                    onValueChange={(value) => handleInputChange('email', value)}
                                    isInvalid={customerErrors.email.length > 0}
                                    endContent={customerErrors.email.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {customerErrors.email.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">NIF</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{customer.nif.length + " / 20"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="nif"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={20}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el NIF del cliente" : data.nif}
                                    value={customer.nif}
                                    onValueChange={(value) => handleInputChange('nif', value)}
                                    isInvalid={customerErrors.nif.length > 0}
                                    endContent={customerErrors.nif.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {customerErrors.nif.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />
                            </Form>

                            {(action === 'create' || action === 'update') && (
                                <div className="w-full flex justify-end py-8 gap-4">
                                    {action === "update" && (
                                        <SecondaryButton
                                            label={data.status === "activo" ? "Inhabilitar" : "Habilitar"}
                                            startContent={data.status === "activo" ? <PersonSubtractFilled className="size-5"/> : <PersonAvailableFilled className="size-5"/>}
                                            onPress={onModalCSOpen}
                                        />
                                    )}

                                    <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                        form="customer-form"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        type="submit"
                                        startContent={!isLoading && <ArrowHookUpRightFilled className="size-5"/>}
                                        isLoading={isLoading}
                                        isDisabled={customer.name === "" || customer.email === "" || customer.nif === "" || customerErrors.name.length > 0 || customerErrors.email.length > 0 || customerErrors.nif.length > 0 }
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            )}
                        </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <CustomersChangeStatusModal isOpen={isModalCSOpen} onOpenChange={onModalCSOpenChange} data={data} onRefresh={onRefresh}/>
            <CustomersModal isOpen={isModalOpen} onOpenChange={onModalOpenChange} data={customer} initialData={data} action={action} onRefresh={onRefresh} closeDrawer={() => {onOpenChange(false); resetForm()}}/>
        </>
    )
}