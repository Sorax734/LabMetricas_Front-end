import { addToast, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, Form, Input, InputOtp, Select, SelectItem, Textarea, useDisclosure } from "@heroui/react"
import { CloseButton } from "../CloseButton"
import { ArrowHookUpRightFilled, CheckmarkCircleFilled, CheckmarkFilled, ChevronDownFilled, DismissCircleFilled, DismissFilled, PersonAvailableFilled, PersonSubtractFilled, SubtractCircleFilled, SubtractFilled, TextAsteriskFilled } from "@fluentui/react-icons"
import { useEffect, useState } from "react"
import { required } from "../../validators/validators"
import { SecondaryButton } from "../SecondaryButton"
import { EquipmentsChangeStatusModal } from "./EquipmentsChangeStatusModal"
import { getEquipments } from "../../service/equipment"
import { EquipmentsModal } from "./EquipmentsModal"

export const EquipmentsDrawer = ({isOpen, onOpenChange, data, action, onRefresh, users, categories, maintenanceProviders}) => {
    const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure()
    const {isOpen: isModalCSOpen, onOpen: onModalCSOpen, onOpenChange: onModalCSOpenChange} = useDisclosure()
    
    const [isLoading, setIsLoading] = useState(false)

    const [equipment, setEquipment] = useState({
        id: data?.id || "",
        name: data?.name || "",
        code: data?.code || "",
        serialNumber: data?.serialNumber || "",
        location: data?.location || "",
        brand: data?.brand || "",
        model: data?.model || "",
        remarks: data?.remarks || "",
        assignedToId: data?.assignedToId || "",
        equipmentCategoryId: data?.equipmentCategoryId || "",
        maintenanceProviderId: data?.maintenanceProviderId || "",
    })

    const [equipmentErrors, setEquipmentErrors] = useState({ 
        name: [],
        code: [],
        serialNumber: [],
        location: [],
        brand: [],
        model: [],
        remarks: [],
        assignedToId: [],
        equipmentCategoryId: [],
        maintenanceProviderId: [],
    })

    useEffect(() => {
        setEquipment({
            id: data?.id || "",
            name: data?.name || "",
            code: data?.code || "",
            serialNumber: data?.serialNumber || "",
            location: data?.location || "",
            brand: data?.brand || "",
            model: data?.model || "",
            remarks: data?.remarks || "",
            assignedToId: data?.assignedToId || "",
            equipmentCategoryId: data?.equipmentCategoryId || "",
            maintenanceProviderId: data?.maintenanceProviderId || "",
        })

        setEquipmentErrors({
            name: [],
            code: [],
            serialNumber: [],
            location: [],
            brand: [],
            model: [],
            remarks: [],
            assignedToId: [],
            equipmentCategoryId: [],
            maintenanceProviderId: [],
        })
    }, [data]);

    const resetForm = () => {
        setEquipment({ id:"", name:"", code:"", serialNumber:"", location:"", brand:"", model:"", remarks:"", assignedToId:"", equipmentCategoryId:"", maintenanceProviderId:"" })
        setEquipmentErrors({ name:[], code:[], serialNumber:[], location:[], brand:[], model:[], remarks:[], assignedToId:[], equipmentCategoryId:[], maintenanceProviderId:[] })
    }

    const validators = {
        name: [required],
        code: [required],
        serialNumber: [required],
        location: [required],
        brand: [required],
        model: [required],
        assignedToId: [required],
        equipmentCategoryId: [required],
        maintenanceProviderId: [required],
    }

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const handleInputChange = (field, value) => {
        setEquipment(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setEquipmentErrors(prev => ({ ...prev, [field]: errs }))
    }

    let title
    let description

    switch (action) {
        case "create":
            title = "Registrar equipo"
            description = "Ingrese la información solicitada para poder registrar un nuevo equipo."
            break
        case "update":
            title = "Actualizar equipo"
            description = "Edite la información necesaria y guarde los cambios para actualizar el equipo."
            break
        default:
            title = "Detalles del equipo"
            description = "Revise la información completa del equipo. Esta vista es solo de lectura."
            break
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))
        
        const formData = action !== "create"
            ? { id: equipment.id, ...formEntries }
            : { ...formEntries };

        try {
            setIsLoading(true)

            const response = await getEquipments()
            const equipments = response.data

            const exists = equipments.find(
                (u) => u.name.trim().toLowerCase() === formData.name.trim().toLowerCase()
            )
            
            if (exists && (action === "create" || exists.id !== formData.id)) {
                setEquipmentErrors((prev) => ({
                    ...prev,
                    name: ["El nombre ingresado ya está en uso."],
                }))
                addToast({
                    title: "El nombre ingresado ya está en uso.",
                    description: "Por favor, ingrese uno distinto.",
                    color: "danger",
                    icon: <DismissCircleFilled className="size-5"/>
                })
                return
            }
        } catch (error) {
            addToast({
                title: `No se pudo verificar el nombre. Intenta de nuevo.`,
                description: error.response.data.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
            return
        } finally {
            setIsLoading(false)
        }

        setEquipmentErrors({ name:[], code:[], serialNumber:[], location:[], brand:[], model:[], remarks:[], assignedToId:[], equipmentCategoryId:[], maintenanceProviderId:[] })
        setEquipment(formData)
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
                            <Form onSubmit={onSubmit} id="equipment-form" className="gap-6 flex flex-col">
                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Nombre</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.name.length + " / 100"}</p>
                                        </div>
                                    }
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
                                    placeholder={action === "create" ? "Ingrese el nombre del equipo" : data.name}
                                    value={equipment.name}
                                    onValueChange={(value) => handleInputChange('name', value)}
                                    isInvalid={equipmentErrors.name.length > 0}
                                    endContent={equipmentErrors.name.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.name.map((error, i) => (
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
                                                <p className="font-medium text-sm">Código</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.code.length + " / 10"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="code"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={10}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el código del equipo" : data.code}
                                    value={equipment.code}
                                    onValueChange={(value) => handleInputChange('code', value)}
                                    isInvalid={equipmentErrors.code.length > 0}
                                    endContent={equipmentErrors.code.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.code.map((error, i) => (
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
                                                <p className="font-medium text-sm">Número de serie</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.serialNumber.length + " / 24"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="serialNumber"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={24}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el número de serie del equipo" : data.serialNumber}
                                    value={equipment.serialNumber}
                                    onValueChange={(value) => handleInputChange('serialNumber', value)}
                                    isInvalid={equipmentErrors.serialNumber.length > 0}
                                    endContent={equipmentErrors.serialNumber.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.serialNumber.map((error, i) => (
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
                                                <p className="font-medium text-sm">Locación</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.location.length + " / 255"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="location"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={255}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese la locación del equipo" : data.location}
                                    value={equipment.location}
                                    onValueChange={(value) => handleInputChange('location', value)}
                                    isInvalid={equipmentErrors.location.length > 0}
                                    endContent={equipmentErrors.location.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.location.map((error, i) => (
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
                                                <p className="font-medium text-sm">Marca</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.brand.length + " / 50"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="brand"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={50}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese la marca del equipo" : data.brand}
                                    value={equipment.brand}
                                    onValueChange={(value) => handleInputChange('brand', value)}
                                    isInvalid={equipmentErrors.brand.length > 0}
                                    endContent={equipmentErrors.brand.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.brand.map((error, i) => (
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
                                                <p className="font-medium text-sm">Modelo</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.model.length + " / 100"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="model"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={100}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el modelo del equipo" : data.model}
                                    value={equipment.model}
                                    onValueChange={(value) => handleInputChange('model', value)}
                                    isInvalid={equipmentErrors.model.length > 0}
                                    endContent={equipmentErrors.model.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.model.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Asignado a:</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Asignado a:"
                                    className="w-full -mt-4"
                                    name="assignedToId"
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    placeholder="Selecciona un usuario"
                                    radius="sm"
                                    selectedKeys={new Set([`${equipment.assignedToId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('assignedToId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={equipmentErrors.assignedToId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {equipmentErrors.assignedToId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {users.map((user) => (<SelectItem key={user.id}>{user.name}</SelectItem>))}
                                </Select>
                                
                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Categoría</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Categoría"
                                    className="w-full -mt-4"
                                    name="equipmentCategoryId"
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    placeholder="Selecciona una categoría"
                                    radius="sm"
                                    selectedKeys={new Set([`${equipment.equipmentCategoryId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('equipmentCategoryId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={equipmentErrors.equipmentCategoryId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {equipmentErrors.equipmentCategoryId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {categories.map((category) => (<SelectItem key={category.id}>{category.name}</SelectItem>))}
                                </Select>

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Proveedor de mantenimiento / calibración</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Proveedor de mantenimiento / calibración"
                                    className="w-full -mt-4"
                                    name="maintenanceProviderId"
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    placeholder="Selecciona un proveedor de mantenimiento / calibración"
                                    radius="sm"
                                    selectedKeys={new Set([`${equipment.maintenanceProviderId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('maintenanceProviderId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={equipmentErrors.maintenanceProviderId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {equipmentErrors.maintenanceProviderId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {maintenanceProviders.map((maintenanceProvider) => (<SelectItem key={maintenanceProvider.id}>{maintenanceProvider.name}</SelectItem>))}
                                </Select>

                                <Textarea
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Observaciones</p>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.remarks.length + " / 1000"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="remarks"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={1000}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese las observaciones del equipo" : data.remarks}
                                    value={equipment.remarks}
                                    onValueChange={(value) => handleInputChange('remarks', value)}
                                    isInvalid={equipmentErrors.remarks.length > 0}
                                    endContent={equipmentErrors.remarks.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.remarks.map((error, i) => (
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
                                            startContent={data.status === "activo" ? <SubtractCircleFilled className="size-5"/> : <CheckmarkCircleFilled className="size-5"/>}
                                            onPress={onModalCSOpen}
                                        />
                                    )}

                                    <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                        form="equipment-form"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        type="submit"
                                        startContent={!isLoading && <ArrowHookUpRightFilled className="size-5"/>}
                                        isLoading={isLoading}
                                        isDisabled={equipment.name === "" || equipment.code === "" || equipment.serialNumber === "" || equipment.location === "" || equipment.brand === "" || equipment.model === "" || equipment.assignedToId === "" || equipment.equipmentCategoryId === "" || equipment.maintenanceProviderId === "" || equipmentErrors.name.length > 0 || equipmentErrors.code.length > 0 || equipmentErrors.serialNumber.length > 0 || equipmentErrors.location.length > 0 || equipmentErrors.brand.length > 0 || equipmentErrors.model.length > 0}
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

            <EquipmentsChangeStatusModal isOpen={isModalCSOpen} onOpenChange={onModalCSOpenChange} data={data} onRefresh={onRefresh}/>
            <EquipmentsModal isOpen={isModalOpen} onOpenChange={onModalOpenChange} data={equipment} initialData={data} action={action} onRefresh={onRefresh} closeDrawer={() => {onOpenChange(false); resetForm()}}/>
        </>
    )
}