import { addToast, Button, DatePicker, Drawer, DrawerBody, DrawerContent, DrawerHeader, Form, Input, InputOtp, NumberInput, Select, SelectItem, Textarea, useDisclosure } from "@heroui/react"
import { CloseButton } from "../CloseButton"
import { ArrowHookUpRightFilled, CheckmarkCircleFilled, CheckmarkFilled, ChevronDownFilled, DismissCircleFilled, DismissFilled, PersonAvailableFilled, PersonSubtractFilled, SubtractCircleFilled, TextAsteriskFilled } from "@fluentui/react-icons"
import { useEffect, useState } from "react"
import { onlyLetters, required, validEmail, validPhone, validRoleId } from "../../validators/validators"
import { SecondaryButton } from "../SecondaryButton"
import { MaintenancesCalibrationsChangeStatusModal } from "./maintenancesCalibrationsChangeStatusModal"
import { MaintenancesCalibrationsModal } from "./maintenancesCalibrationsModal"

export const MaintenancesCalibrationsDrawer = ({isOpen, onOpenChange, data, action, onRefresh, isScheduled, users, maintenanceTypes, equipments}) => {
    const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure()
    const {isOpen: isModalCSOpen, onOpen: onModalCSOpen, onOpenChange: onModalCSOpenChange} = useDisclosure()
    
    const [names, setNames] = useState({
        equipment: "",
        maintenanceType: "",
        responsible: ""
    })

    const [maintenance, setMaintenance] = useState({
        id: data?.id || "",
        equipmentId: data?.equipmentId || "",
        maintenanceTypeId: data?.maintenanceTypeId || "",
        responsibleUserId: data?.responsibleUserId || "",
        description: data?.description || "",
        priority: data?.priority || ""
    })

    const [scheduledMaintenace, setScheduledMaintenance] = useState({
        id: data?.id || "",
        maintenanceId: data?.maintenanceId || "",
        monthlyFrequency: data?.monthlyFrequency || "",
        nextMaintenance: data?.nextMaintenance || "",
    })

    const [maintenanceErrors, setMaintenanceErrors] = useState({ 
        equipmentId: [],
        maintenanceTypeId: [],
        responsibleUserId: [],
        description: [],
        priority: [],
    })

    const [scheduledMaintenaceErrors, setScheduledMaintenaceErrors] = useState({ 
        maintenanceId: [],
        monthlyFrequency: [],
        nextMaintenance: [],
    })

    useEffect(() => {
        setMaintenance({
            id: data?.id || "",
            equipmentId: data?.equipmentId || "",
            maintenanceTypeId: data?.maintenanceTypeId || "",
            responsibleUserId: data?.responsibleUserId || "",
            description: data?.description || "",
            priority: data?.priority || "",
        })

        setScheduledMaintenance({
            id: data?.id || "",
            maintenanceId: data?.maintenanceId || "",
            monthlyFrequency: data?.monthlyFrequency || "",
            nextMaintenance: data?.nextMaintenance || "",
        })

        setMaintenanceErrors({
            equipmentId: [],
            maintenanceTypeId: [],
            responsibleUserId: [],
            description: [],
            priority: [],
        })

        setScheduledMaintenaceErrors({
            maintenanceId: [],
            monthlyFrequency: [],
            nextMaintenance: [],
        })
    }, [data]);

    const resetForm = () => {
        setMaintenance({ id:"", equipmentId:"", maintenanceTypeId:"", responsibleUserId:"", description:"", priority:"" })
        setScheduledMaintenance({ id:"", maintenanceId:"", monthlyFrequency:"", nextMaintenance:"" })
        setMaintenanceErrors({ equipmentId:[], maintenanceTypeId:[], responsibleUserId:[], description:[], priority:[] })
        setScheduledMaintenaceErrors({ maintenanceId:[], monthlyFrequency:[], nextMaintenance:[] })
    }

    const validators = {
        equipmentId: [required],
        maintenanceTypeId: [required],
        responsibleUserId: [required],
        priority: [required],
    }

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const handleInputChange = (field, value) => {
        setMaintenance(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setMaintenanceErrors(prev => ({ ...prev, [field]: errs }))
    }

    const handleInputChangeScheduledMaintenance = (field, value) => {
        setScheduledMaintenaceErrors(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setScheduledMaintenaceErrors(prev => ({ ...prev, [field]: errs }))
    }

    let title
    let description

    switch (action) {
        case "create":
            title = isScheduled ? "Registrar mantenimiento / calibración programado" : "Solicitar mantenimiento / calibración"
            description = "Ingrese la información solicitada para poder registrar el mantenimiento / calibración."
            break
        case "update":
            title = isScheduled ? "Actualizar mantenimiento / calibración programado" : "Actualizar solicitud de mantenimiento / calibración"
            description = "Edite la información necesaria y guarde los cambios para actualizar el registro."
            break
        default:
            title = "Detalles del mantenimiento / calibración"
            description = "Revise la información completa del mantenimiento / calibración. Esta vista es solo de lectura."
            break
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))
        
        const formData = action !== "create"
            ? { id: maintenance.id, ...formEntries }
            : { ...formEntries }
        
        const selectedEquipment = equipments.find(eq => eq.id === formData.equipmentId)
        const selectedMaintenanceType = maintenanceTypes.find(mt => mt.id === formData.maintenanceTypeId)
        const selectedUser = users.find(u => u.id === formData.responsibleUserId)

        const equipmentName = selectedEquipment?.name || "—"
        const maintenanceTypeName = selectedMaintenanceType?.name || "—"
        const responsibleUserName = selectedUser?.name || "—"

        setNames({
            equipment: equipmentName,
            maintenanceType: maintenanceTypeName,
            responsible: responsibleUserName
        })

        setMaintenanceErrors({ equipmentId:[], maintenanceTypeId:[], responsibleUserId:[], description:[], priority:[] })
        setMaintenance(formData)
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
                            <Form onSubmit={onSubmit} id="user-form" className="gap-6 flex flex-col">
                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Equipo</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Equipo"
                                    className="w-full -mt-4"
                                    name="equipmentId"
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
                                    placeholder="Selecciona un equipo"
                                    radius="sm"
                                    selectedKeys={new Set([`${maintenance.equipmentId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('equipmentId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={maintenanceErrors.equipmentId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {maintenanceErrors.equipmentId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {equipments.map((equipment) => (<SelectItem key={equipment.id}>{equipment.name}</SelectItem>))}
                                </Select>

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Tipo de mantenimiento</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Tipo de mantenimiento"
                                    className="w-full -mt-4"
                                    name="maintenanceTypeId"
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
                                    placeholder="Selecciona un tipo de mantenimiento"
                                    radius="sm"
                                    selectedKeys={new Set([`${maintenance.maintenanceTypeId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('maintenanceTypeId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={maintenanceErrors.maintenanceTypeId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {maintenanceErrors.maintenanceTypeId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {maintenanceTypes.map((maintenanceType) => (<SelectItem key={maintenanceType.id}>{maintenanceType.name}</SelectItem>))}
                                </Select>

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Responsable de mantenimiento</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Responsable de mantenimiento"
                                    className="w-full -mt-4"
                                    name="responsibleUserId"
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
                                    placeholder="Selecciona un responsable de mantenimiento"
                                    radius="sm"
                                    selectedKeys={new Set([`${maintenance.responsibleUserId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('responsibleUserId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={maintenanceErrors.responsibleUserId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {maintenanceErrors.responsibleUserId.map((error, i) => (
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
                                        <p className="font-medium text-sm pl-0.5">Prioridad</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Prioridad"
                                    className="w-full -mt-4"
                                    name="priority"
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
                                    placeholder="Selecciona una prioridad"
                                    radius="sm"
                                    selectedKeys={new Set([`${maintenance.priority}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('priority', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={maintenanceErrors.priority.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {maintenanceErrors.priority.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    <SelectItem key="LOW">Baja</SelectItem>
                                    <SelectItem key="MEDIUM">Media</SelectItem>
                                    <SelectItem key="HIGH">Alta</SelectItem>
                                    <SelectItem key="CRITICAL">Crítica</SelectItem>
                                </Select>

                                <Textarea
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Descripción</p>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{maintenance.description.length + " / 1000"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="description"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={1000}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese las observaciones del equipo" : data.description}
                                    value={maintenance.description}
                                    onValueChange={(value) => handleInputChange('description', value)}
                                    isInvalid={maintenanceErrors.description.length > 0}
                                    endContent={maintenanceErrors.description.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {maintenanceErrors.description.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                {isScheduled && (
                                    <>
                                    <DatePicker
                                        label={
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-1">
                                                    <p className="font-medium text-sm">Próximo</p>
                                                    <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                                </div>
                                            </div>
                                        }
                                        classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                        className="w-full"
                                        color="primary"
                                        name="nextMaintenance"
                                        labelPlacement="outside"
                                        radius="sm"
                                        size="md"
                                        variant="bordered"
                                        isReadOnly={action !== 'create' && action !== 'update'}
                                        placeholderValue={action === "create" ? undefined : data.nextMaintenance}
                                        value={scheduledMaintenace.nextMaintenance}
                                        onChange={(value) => handleInputChange('nextMaintenance', value)}
                                        isInvalid={scheduledMaintenaceErrors.nextMaintenance.length > 0}
                                        endContent={scheduledMaintenaceErrors.nextMaintenance.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                        errorMessage={() => (
                                            <div className="flex text-danger">
                                                <ul>
                                                    {scheduledMaintenaceErrors.nextMaintenance.map((error, i) => (
                                                        <li key={i}>{error}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    />

                                    <NumberInput
                                        label={
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-1">
                                                    <p className="font-medium text-sm">Frecuencia por mes:</p>
                                                    <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                                </div>
                                            </div>
                                        }
                                        classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                        className="w-full"
                                        color="primary"
                                        name="monthlyFrequency"
                                        labelPlacement="outside"
                                        radius="sm"
                                        size="md"
                                        variant="bordered"
                                        minValue={1}
                                        maxValue={1000}
                                        step={1}
                                        isReadOnly={action !== 'create' && action !== 'update'}
                                        placeholder={action === "create" ? 1 : data.monthlyFrequency}
                                        value={scheduledMaintenace.monthlyFrequency}
                                        onValueChange={(value) => handleInputChangeScheduledMaintenance('monthlyFrequency', value)}
                                        isInvalid={scheduledMaintenaceErrors.monthlyFrequency.length > 0}
                                        endContent={scheduledMaintenaceErrors.monthlyFrequency.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                        errorMessage={() => (
                                            <div className="flex text-danger">
                                                <ul>
                                                    {scheduledMaintenaceErrors.monthlyFrequency.map((error, i) => (
                                                        <li key={i}>{error}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    />
                                    </>
                                )}
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
                                        form="user-form"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        type="submit"
                                        startContent={<ArrowHookUpRightFilled className="size-5"/>}
                                        isDisabled={maintenance.equipmentId === "" || maintenance.maintenanceTypeId === "" || maintenance.responsibleUserId === "" || maintenance.priority === "" || maintenanceErrors.equipmentId.length > 0 || maintenanceErrors.maintenanceTypeId.length > 0 || maintenanceErrors.responsibleUserId.length > 0 || maintenanceErrors.description.length > 0 || maintenanceErrors.priority.length > 0}
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

            <MaintenancesCalibrationsChangeStatusModal isOpen={isModalCSOpen} onOpenChange={onModalCSOpenChange} data={data} onRefresh={onRefresh}/>
            <MaintenancesCalibrationsModal isOpen={isModalOpen} onOpenChange={onModalOpenChange} data={maintenance} initialData={data} action={action} onRefresh={onRefresh} equipmentName={names.equipment} responsibleUserName={names.responsible} maintenanceTypeName={names.maintenanceType} closeDrawer={() => {onOpenChange(false); resetForm()}}/>
        </>
    )
}