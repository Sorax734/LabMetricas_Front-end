import { addToast, Spinner as SpinnerH, Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Pagination, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, ScrollShadow, ButtonGroup, useDisclosure, useDraggable, Modal, ModalContent, ModalHeader, ModalBody, Form, Input, ModalFooter } from "@heroui/react"
import { getUsers } from "../service/user"
import { PrimaryButton } from "../components/PrimaryButton"
import React, { useEffect, useRef, useState, useTransition } from "react"
import { useIsIconOnlyMedium } from "../hooks/useIsIconOnly"
import { AddCircleFilled, ArrowSortDownLinesFilled, ArrowSortFilled, ArrowSortUpLinesFilled, CheckmarkCircleFilled, CheckmarkFilled, ChevronDownFilled, CircleFilled, DismissCircleFilled, DismissFilled, EditFilled, InfoFilled, MoreVerticalFilled, OptionsFilled, PeopleFilled, PeopleToolboxFilled, PersonAddFilled, PersonAvailableFilled, PersonEditFilled, PersonSubtractFilled, PersonWrenchFilled, SettingsCogMultipleFilled, SettingsFilled, SubtractCircleFilled, TagAddFilled, TagEditFilled, TagFilled, TextAsteriskFilled, WrenchFilled, WrenchScrewdriverFilled, WrenchSettingsFilled } from "@fluentui/react-icons"
import { motion } from "framer-motion"
import { useNavigate, useOutletContext } from "react-router-dom"
import { UsersDrawer } from "../components/users/UsersDrawer"
import { createCategory, getCategories, updateCategory, changeStatus as changeStatusCategory } from "../service/category"
import { getMaintenanceTypes } from "../service/maintenanceType"
import { createMaintenanceProvider, getMaintenanceProviders, updateMaintenanceProvider, changeStatus as changeStatusMaintenanceProvider } from "../service/maintenanceProvider"
import { getEquipments } from "../service/equipment"
import { getMaintenances } from "../service/maintenanceCalibration"
import { getCustomers } from "../service/customer"
import { EquipmentsDrawer } from "../components/equipments/EquipmentsDrawer"
import { MaintenancesCalibrationsDrawer } from "../components/maintenancesCalibrations/MaintenancesCalibrationsDrawer"
import { required } from "../validators/validators"
import { CloseButton } from "../components/CloseButton"
import { CustomersDrawer } from "../components/customers/CustomersDrawer"

export const Home = () => {
    let navigate = useNavigate()

    const [selectedOption, setSelectedOption] = React.useState(new Set(["category"]))

    const labelsMap = {
        category: "Registrar categoría",
        type: "Registrar tipo",
        provider: "Registrar proveedor",
    }
    
    const iconsMap = {
        category: <TagAddFilled className="size-5"/>,
        type: <WrenchFilled className="size-5"/>,
        provider: <PersonWrenchFilled className="size-5"/>,
    }

    const selectedOptionValue = Array.from(selectedOption)[0]
    const [modalEntity, setModalEntity] = useState(selectedOptionValue)

    const [isLoading, setIsLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(false)
    const triggerRefresh = () => setRefreshTrigger(prev => !prev)
    const { searchValue, setSearchValue, userName } = useOutletContext()

    const [cards, setCards] = useState([])
    const [isDUsersOpen, setIsDUsersOpen] = useState(false)
    const [isDCustomersOpen, setIsDCustomersOpen] = useState(false)
    const [isDEquipmentsOpen, setIsDEquipmentsOpen] = useState(false)
    const [isDMaintenancesOpen, setIsDMaintenancesOpen] = useState(false)

    const [categories, setCategories] = useState([])
    const [maintenanceTypes, setMaintenanceTypes] = useState([])
    const [maintenanceProviders, setMaintenanceProviders] = useState([])
    const [users, setUsers] = useState([])
    const [equipments, setEquipments] = useState([])
    const [maintenances, setMaintenances] = useState([])

    const [errors, setErrors] = useState([])

    const isIconOnlyMedium = useIsIconOnlyMedium()
    const [, startTransition] = useTransition()

    const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure()

    const [selected, setSelected] = useState({})
    const [action, setAction] = useState("")

    const hasSearchFilter = Boolean(searchValue)

    useEffect(() => {
        setSearchValue("")
    }, [])

    const [filteredMaintenanceProviders, filteredCategories, filteredMaintenanceTypes] = React.useMemo(() => {
        let providersFilt = [...maintenanceProviders]
        let catsFilt = [...categories]
        let typesFilt = [...maintenanceTypes]
    
        if (hasSearchFilter) {
            providersFilt = providersFilt.filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase()),
            )
            
            catsFilt = catsFilt.filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase()),
            )
            
            typesFilt = typesFilt.filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase()),
            )
        }

        return [providersFilt, catsFilt, typesFilt];
    }, [maintenanceProviders, categories, maintenanceTypes, searchValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                const categoriesResponse = await getCategories()
                const maintenanceTypesResponse = await getMaintenanceTypes()
                const maintenanceProvidersResponse = await getMaintenanceProviders()

                const equipmentsResponse = await getEquipments()
                const usersResponse = await getUsers()
                const maintenancesResponse = await getMaintenances()
                const customersResponse = await getCustomers()

                const categoriesData = categoriesResponse.data
                const maintenanceTypesData = maintenanceTypesResponse.data
                const maintenanceProvidersData = maintenanceProvidersResponse.data
                
                const equipmentsData = equipmentsResponse.data
                const maintenancesData = maintenancesResponse.data
                const customersData = customersResponse.data
                const usersData = usersResponse.data

                if (categoriesData && maintenanceTypesData && maintenanceProvidersData && equipmentsData && maintenancesData && usersData) {
                    const categoriesDataN = categoriesData.map((item, index) => ({...item, n: index + 1, pageIndex: (index % 5) + 1,}))
                    const maintenanceTypesDataN = maintenanceTypesData.map((item, index) => ({...item, n: index + 1, pageIndex: (index % 5) + 1,}))
                    const maintenanceProvidersDataN = maintenanceProvidersData.map((item, index) => ({...item, n: index + 1, pageIndex: (index % 5) + 1,}))
                    
                    const cardsData = [
                        {
                            title:       'Usuarios',
                            itemsLength: usersData.length,
                            items: usersData,
                            icon:        <PeopleFilled className="size-5" />,
                            startContent:<PersonAddFilled className="size-5" />,
                            buttonLabel: 'Registrar',
                            onPress:     () => navigate("/App/Users"),
                            onButtonPress: () => setIsDUsersOpen(true)
                        },
                        {
                            title:       'Equipos',
                            itemsLength: equipmentsData.length,
                            items: equipmentsData,
                            icon:        <SettingsCogMultipleFilled className="size-5" />,
                            startContent:<SettingsFilled className="size-5" />,
                            buttonLabel: 'Registrar',
                            onPress:     () => navigate("/App/Equipments"),
                            onButtonPress: () => setIsDEquipmentsOpen(true)
                        },
                        {
                            title:       'Mantenimientos',
                            itemsLength: maintenancesData.length,
                            items: maintenancesData,
                            icon:        <WrenchSettingsFilled className="size-5" />,
                            startContent:<WrenchScrewdriverFilled className="size-5" />,
                            buttonLabel: 'Solicitar',
                            onPress:     () => navigate("/App/Maintenance-Calibration"),
                            onButtonPress: () => setIsDMaintenancesOpen(true)
                        },
                        {
                            title:       'Clientes',
                            itemsLength: customersData.length,
                            items: customersData,
                            icon:        <PeopleToolboxFilled className="size-5" />,
                            startContent:<PersonAddFilled className="size-5" />,
                            buttonLabel: 'Registrar',
                            onPress:     () => navigate("/App/Customers"),
                            onButtonPress: () => setIsDCustomersOpen(true)
                        },
                    ]

                    startTransition(() => {
                        setCategories(categoriesDataN)
                        setMaintenanceTypes(maintenanceTypesDataN)
                        setMaintenanceProviders(maintenanceProvidersDataN)
                        setCards(cardsData)
                        setUsers(usersData)
                        setEquipments(equipmentsData)
                        setMaintenances(maintenancesData)

                        setSelected(prev => {
                            if (!prev) return null
                            const updated = categoriesData.find(u => u.id === prev.id)
                            return updated ?? prev
                        })

                        setSelected(prev => {
                            if (!prev || !prev.id) return null

                            const foundInCategories  = categoriesData.find(u => u.id === prev.id)
                            const foundInMaintenanceTypes = maintenanceTypesData.find(u => u.id === prev.id)
                            const foundInMaintenanceProviders = maintenanceProvidersData.find(u => u.id === prev.id)

                            return foundInCategories || foundInMaintenanceTypes || foundInMaintenanceProviders || prev
                        })

                        setIsLoading(false)
                    })
                } else {
                    addToast({
                        title: "No se pudieron obtener los datos",
                        description: "Ocurrió un error al obtener los datos",
                        color: "danger",
                        icon: <DismissCircleFilled className='size-5' />
                    })
                    startTransition(() => {
                        setErrors(prev => [...prev, "No se pudieron obtener los datos"])
                        setIsLoading(false)
                    })
                }
            } catch (err) {
                startTransition(() => {
                    setErrors(prev => [...prev, err.message])
                    setIsLoading(false)
                })
            }
        }
        fetchData()
    }, [refreshTrigger])

    const handleRead = (item, entity) => {
        setAction("read")
        setModalEntity(entity)
        setSelected(item)
    }

    const handleCreate = () => {
        setAction("create")
        setModalEntity(selectedOptionValue)
        setSelected(null)
        onModalOpen()
    }

    const handleUpdate = (item, entity) => {
        setAction("update")
        setModalEntity(entity)
        setSelected(item)
    }

    const handleChangeStatus = (item, entity) => {
        setSelected(item)
        setAction("")
        setModalEntity(entity)
        onModalOpen()
    }
    
    const lengthCard = (onPress, onButtonPress, title, itemsLength, icon, startContent, buttonLabel) => {
        return (
            <Card shadow="none" radius="sm" isPressable onPress={onPress} className="w-full transition-colors !duration-1000 ease-in-out bg-transparent
            shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]
            dark:shadow-[0px_0px_10px_0px_rgba(255,255,255,0.1)]">
                <CardBody className="px-4 py-2">
                    <div className="p-2">
                        <div className="flex flex-col items-center">
                            <p className="text-sm">{title}</p>
                            <div className="flex items-center gap-2 pb-2">
                                <p className="text-4xl font-bold">{itemsLength}</p>
                                {icon}
                            </div>
                            
                            <Button startContent={startContent} color="primary" variant="shadow" className="font-medium tracking-wide data-[hover=true]:-translate-y-1" size="md" radius="sm" as="a" onPress={onButtonPress}>
                                {buttonLabel}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        )
    }

    const miniCard = (title, itemsLength, icon) => {
        return (
            <Card shadow="none" radius="sm" className="w-full transition-colors !duration-1000 ease-in-out bg-transparent
            shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]
            dark:shadow-[0px_0px_10px_0px_rgba(255,255,255,0.1)]">
                <CardBody className="px-4 py-2">
                    <div className="p-2">
                        <div className="flex justify-between">
                            <div className="flex flex-col justify-center">
                                <p className="text-base font-bold">{title}</p>
                            </div>
                            <div className="flex flex-col items-end justify-center">
                                <div className="flex items-center gap-2">
                                    <p className="text-4xl font-bold">{itemsLength}</p>
                                    {icon}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        )
    }

    return (
        <>
            {isLoading ? (
                <div className="w-full h-full">
                    <p className="text-lg font-bold">Inicio</p>
                    
                    <div className="w-full pt-[62px] flex justify-center">
                        <SpinnerH
                            classNames={{ label: "pt-2 text-sm font-medium" }}
                            color="current"
                            size="md"
                            label="Espere un poco por favor"
                        />
                    </div>
                </div>
            ) : ( errors.length > 0 ? (
                <div className="w-full h-full">
                    <p className="text-lg font-bold">Inicio</p>

                    <div className="space-y-4 pt-4">
                        {errors.map((msg, i) => (
                        <motion.div
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                        >
                            <div key={i} className="bg-danger-50 rounded-lg border-danger-100 border py-4 px-3 flex gap-3">
                                <div className="flex items-center justify-center text-danger-600">
                                    <DismissCircleFilled className="size-5" />
                                </div>
                                <div className="text-sm text-danger-600">
                                    <p className="font-medium break-words">{msg}</p>
                                </div>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                </div>
            ) : ( categories.length > 0 && maintenanceTypes.length > 0 && maintenanceProviders.length > 0 && (
                <div className="w-full h-full flex flex-col">
                    <div className="flex justify-between gap-4 pb-4 sm:pb-4">
                        <div className="flex flex-col">
                            <p className="text-lg font-bold">Inicio</p>
                            <span className="text-background-500 text-xs line-clamp-2">Mostrando categorías, tipos y proveedores</span>
                        </div>
                        <ButtonGroup variant="flat">
                            <Button startContent={iconsMap[selectedOptionValue]} onPress={handleCreate} color="primary" variant="shadow" className="font-medium tracking-wide" size="md" radius="sm">
                                {labelsMap[selectedOptionValue]}
                            </Button>
                            <Dropdown placement="bottom-end" className="bg-background-100 w-52 transition-colors duration-1000 ease-in-out" shadow="lg" radius="sm" >
                                <DropdownTrigger>
                                    <Button isIconOnly color="primary" variant="shadow" size="md" radius="sm">
                                        <ChevronDownFilled className="text-background"/>
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    variant="light"
                                    aria-label="Registrar"
                                    selectedKeys={selectedOption}
                                    selectionMode="single"
                                    onSelectionChange={setSelectedOption}
                                    itemClasses={{base:"mb-1"}}
                                >
                                    <DropdownItem 
                                        key="category" 
                                        className="rounded-md transition-all !duration-1000 ease-in-out"
                                        startContent={iconsMap["category"]}
                                    >
                                        {labelsMap["category"]}
                                    </DropdownItem>
                                    <DropdownItem 
                                        key="type" 
                                        className="rounded-md transition-all !duration-1000 ease-in-out"
                                        startContent={iconsMap["type"]}
                                    >
                                        {labelsMap["type"]}
                                    </DropdownItem>
                                    <DropdownItem 
                                        key="provider" 
                                        className="rounded-md transition-all !duration-1000 ease-in-out"
                                        startContent={iconsMap["provider"]}
                                    >
                                        {labelsMap["provider"]}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </ButtonGroup>
                    </div>
                    
                    <p className="font-bold text-2xl pb-8">¡Hola, {userName}!</p>
                        
                    <div className="grid grid-cols-2 grid-rows-2 md:grid-rows-1 md:grid-cols-4 gap-4 pb-4">
                        {cards.map((c, i) => (
                            <motion.div
                                key={c.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                            >
                                {lengthCard(
                                    c.onPress,
                                    c.onButtonPress,
                                    c.title,
                                    c.itemsLength,
                                    c.icon,
                                    c.startContent,
                                    c.buttonLabel
                                )}
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="w-full lg:min-h-0 grid lg:grid-cols-3 grid-cols-1 grid-rows-3 lg:grid-rows-1 gap-4">
                        <ScrollShadow className="h-full bg-transparent flex flex-col gap-2 p-2
                        [&::-webkit-scrollbar]:h-1
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-transparent">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 1 * 0.1 }}
                                >
                                    {miniCard("Categorías de equipos", categories.length, <TagFilled className="size-5"/>)}
                                </motion.div>
                            </div>
                                
                            {filteredCategories.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: item.n * 0.1 }}
                                >
                                    <Card shadow="none" radius="sm" isPressable onPress={() => {handleRead(item, "category"); onModalOpen()}} className="w-full transition-colors !duration-1000 ease-in-out bg-transparent
                                    shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]
                                    dark:shadow-[0px_0px_10px_0px_rgba(255,255,255,0.04)]">
                                        <CardBody className="px-4 py-2">
                                            <div className={`absolute top-1/2 left-0 transform -translate-y-1/2 w-1 h-10 ${item.status ? "bg-primary" : "bg-background-500"} rounded-full`}></div>
                                            <div className="w-full h-full flex justify-between">
                                                <div>
                                                    <div className="flex gap-1 pb-1 items-end">
                                                        <p className="text-sm font-medium break-all line-clamp-1">{item.name}</p>
                                                    </div>
                                                    <div className={`flex gap-1 text-xs items-start ${item.status ? "text-primary" : "text-background-500"}`}>
                                                        <p className="text-xs text-background-950 pb-[2px]">#{item.n}</p>
                                                        <p>{item.status ? "Activo" : "Inactivo"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center pl-2">
                                                    <Dropdown placement="bottom-end" className="bg-background-100 transition-colors duration-1000 ease-in-out" offset={28} shadow="lg" radius="sm" classNames={{content: "min-w-44"}}>
                                                        <DropdownTrigger>
                                                            <Button className="bg-transparent" size="sm" radius="sm" isIconOnly as="a">
                                                                <MoreVerticalFilled className="size-5"/>
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Acciones" variant="light" itemClasses={{base:"mt-1 mb-2"}}>
                                                            <DropdownSection title="Acciones" classNames={{ heading: "text-background-500 font-normal"}}>
                                                                <DropdownItem 
                                                                    className="rounded-md transition-all !duration-1000 ease-in-out w-40"
                                                                    key="handleUpdate"
                                                                    startContent={<EditFilled className="size-5"/>}
                                                                    onPress={() => {handleUpdate(item, "category"); onModalOpen()}}
                                                                >
                                                                    Actualizar
                                                                </DropdownItem>

                                                                <DropdownItem 
                                                                    className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mt-1"
                                                                    key="handleRead"
                                                                    startContent={<InfoFilled className="size-5"/>}
                                                                    onPress={() => {handleRead(item, "category"); onModalOpen()}}
                                                                >
                                                                    Ver más detalles
                                                                </DropdownItem>

                                                                <DropdownItem 
                                                                    className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mb-1"
                                                                    key="handleChangeStatus"
                                                                    startContent={item.status ? <SubtractCircleFilled className="size-5"/> : <CheckmarkCircleFilled className="size-5"/>}
                                                                    onPress={() => handleChangeStatus(item, "category")}
                                                                >
                                                                    {item.status ? "Inhabilitar" : "Habilitar"}
                                                                </DropdownItem>
                                                            </DropdownSection>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </ScrollShadow>

                        <ScrollShadow className="h-full bg-transparent flex flex-col gap-2 p-2
                        [&::-webkit-scrollbar]:h-1
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-transparent">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 2 * 0.1 }}
                                >
                                    {miniCard("Tipos de mantenimiento", maintenanceTypes.length, <WrenchFilled className="size-5"/>)}
                                </motion.div>
                            </div>

                            {filteredMaintenanceTypes.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: item.n * 0.1 }}
                                >
                                    <Card shadow="none" radius="sm" isPressable onPress={() => {handleRead(item, "type"); onModalOpen()}} className="w-full transition-colors !duration-1000 ease-in-out bg-transparent
                                    shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]
                                    dark:shadow-[0px_0px_10px_0px_rgba(255,255,255,0.04)]">
                                        <CardBody className="px-4 py-2">
                                            <div className={`absolute top-1/2 left-0 transform -translate-y-1/2 w-1 h-10 ${item.status ? "bg-primary" : "bg-background-500"} rounded-full`}></div>
                                            <div className="w-full h-full flex justify-between">
                                                <div>
                                                    <div className="flex gap-1 pb-1 items-end">
                                                        <p className="text-sm font-medium break-all line-clamp-1">{item.name}</p>
                                                    </div>
                                                    <div className={`flex gap-1 text-xs items-start ${item.status ? "text-primary" : "text-background-500"}`}>
                                                        <p className="text-xs text-background-950 pb-[2px]">#{item.n}</p>
                                                        <p>{item.status ? "Activo" : "Inactivo"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center pl-2">
                                                    <Dropdown placement="bottom-end" className="bg-background-100 transition-colors duration-1000 ease-in-out" offset={28} shadow="lg" radius="sm" classNames={{content: "min-w-44"}}>
                                                        <DropdownTrigger>
                                                            <Button className="bg-transparent" size="sm" radius="sm" isIconOnly as="a">
                                                                <MoreVerticalFilled className="size-5"/>
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Acciones" variant="light" itemClasses={{base:"mt-1 mb-2"}}>
                                                            <DropdownSection title="Acciones" classNames={{ heading: "text-background-500 font-normal"}}>
                                                                <DropdownItem 
                                                                    className="rounded-md transition-all !duration-1000 ease-in-out w-40"
                                                                    key="handleUpdate"
                                                                    startContent={<EditFilled className="size-5"/>}
                                                                    onPress={() => {handleUpdate(item, "type"); onModalOpen()}}
                                                                >
                                                                    Actualizar
                                                                </DropdownItem>

                                                                <DropdownItem 
                                                                    className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mt-1"
                                                                    key="handleRead"
                                                                    startContent={<InfoFilled className="size-5"/>}
                                                                    onPress={() => {handleRead(item, "type"); onModalOpen()}}
                                                                >
                                                                    Ver más detalles
                                                                </DropdownItem>

                                                                <DropdownItem 
                                                                    className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mb-1"
                                                                    key="handleChangeStatus"
                                                                    startContent={item.status ? <SubtractCircleFilled className="size-5"/> : <CheckmarkCircleFilled className="size-5"/>}
                                                                    onPress={() => handleChangeStatus(item, "type")}
                                                                >
                                                                    {item.status ? "Inhabilitar" : "Habilitar"}
                                                                </DropdownItem>
                                                            </DropdownSection>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </ScrollShadow>

                        <ScrollShadow className="h-full bg-transparent flex flex-col gap-2 p-2
                        [&::-webkit-scrollbar]:h-1
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-transparent">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 3 * 0.1 }}
                                >
                                    {miniCard("Proveedores de mantenimiento", maintenanceProviders.length, <PersonWrenchFilled className="size-5"/>)}
                                </motion.div>
                            </div>

                            {filteredMaintenanceProviders.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: item.n * 0.1 }}
                                >
                                    <Card shadow="none" radius="sm" isPressable onPress={() => {handleRead(item, "provider"); onModalOpen()}} className="w-full transition-colors !duration-1000 ease-in-out bg-transparent
                                    shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]
                                    dark:shadow-[0px_0px_10px_0px_rgba(255,255,255,0.04)]">
                                        <CardBody className="px-4 py-2">
                                            <div className={`absolute top-1/2 left-0 transform -translate-y-1/2 w-1 h-10 ${item.status ? "bg-primary" : "bg-background-500"} rounded-full`}></div>
                                            <div className="w-full h-full flex justify-between">
                                                <div>
                                                    <div className="flex gap-1 pb-1 items-end">
                                                        <p className="text-sm font-medium break-all line-clamp-1">{item.name}</p>
                                                    </div>
                                                    <div className={`flex gap-1 text-xs items-start ${item.status ? "text-primary" : "text-background-500"}`}>
                                                        <p className="text-xs text-background-950 pb-[2px]">#{item.n}</p>
                                                        <p>{item.status ? "Activo" : "Inactivo"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center pl-2">
                                                    <Dropdown placement="bottom-end" className="bg-background-100 transition-colors duration-1000 ease-in-out" offset={28} shadow="lg" radius="sm" classNames={{content: "min-w-44"}}>
                                                        <DropdownTrigger>
                                                            <Button className="bg-transparent" size="sm" radius="sm" isIconOnly as="a">
                                                                <MoreVerticalFilled className="size-5"/>
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Acciones" variant="light" itemClasses={{base:"mt-1 mb-2"}}>
                                                            <DropdownSection title="Acciones" classNames={{ heading: "text-background-500 font-normal"}}>
                                                                <DropdownItem 
                                                                    className="rounded-md transition-all !duration-1000 ease-in-out w-40"
                                                                    key="handleUpdate"
                                                                    startContent={<EditFilled className="size-5"/>}
                                                                    onPress={() => {handleUpdate(item, "provider"); onModalOpen()}}
                                                                >
                                                                    Actualizar
                                                                </DropdownItem>

                                                                <DropdownItem 
                                                                    className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mt-1"
                                                                    key="handleRead"
                                                                    startContent={<InfoFilled className="size-5"/>}
                                                                    onPress={() => {handleRead(item, "provider"); onModalOpen()}}
                                                                >
                                                                    Ver más detalles
                                                                </DropdownItem>

                                                                <DropdownItem 
                                                                    className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mb-1"
                                                                    key="handleChangeStatus"
                                                                    startContent={item.status ? <SubtractCircleFilled className="size-5"/> : <CheckmarkCircleFilled className="size-5"/>}
                                                                    onPress={() => handleChangeStatus(item, "provider")}
                                                                >
                                                                    {item.status ? "Inhabilitar" : "Habilitar"}
                                                                </DropdownItem>
                                                            </DropdownSection>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </ScrollShadow>
                    </div>
                </div>)
            ))}

            <MaintenancesCalibrationsDrawer isOpen={isDMaintenancesOpen} onOpenChange={setIsDMaintenancesOpen} data={null} action={"create"} onRefresh={triggerRefresh} isScheduled={false} users={users.filter(u => u.status)} equipments={equipments.filter(u => u.status)} maintenanceTypes={maintenanceTypes.filter(u => u.status)}/>
            <UsersDrawer isOpen={isDUsersOpen} onOpenChange={setIsDUsersOpen} data={null} action={"create"} onRefresh={triggerRefresh}/>
            <EquipmentsDrawer isOpen={isDEquipmentsOpen} onOpenChange={setIsDEquipmentsOpen} data={null} action={"create"} onRefresh={triggerRefresh} users={users.filter(u => u.status)} categories={categories.filter(u => u.status)} maintenanceProviders={maintenanceProviders.filter(u => u.status)}/>
            <CustomersDrawer isOpen={isDCustomersOpen} onOpenChange={setIsDCustomersOpen} data={null} action={"create"} onRefresh={triggerRefresh}/>
            <CRUDModal isOpen={isModalOpen} onOpenChange={onModalOpenChange} data={selected} action={action} onRefresh={triggerRefresh} entity={modalEntity}/>
        </>
    )
}

export const CRUDModal = ({isOpen, onOpenChange, data, action, onRefresh, entity}) => {
    const targetRef = useRef(null)
    const {moveProps} = useDraggable({targetRef, isDisabled: !isOpen})

    const [multiObject, setMultiObject] = useState({
        id: data?.id || "",
        name: data?.name || "",
    })

    const [multiObjectErrors, setMultiObjectErrors] = useState({ 
        name: [],
    })

    useEffect(() => {
        setMultiObject({
            id: data?.id || "",
            name: data?.name || "",
        })

        setMultiObjectErrors({
            name: [],
        })
    }, [data, entity])

    const resetForm = () => {
        setMultiObject({ id:"", name:"" })
        setMultiObjectErrors({ name:[] })
    }

    const validators = {
        name: [required],
    }

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const handleInputChange = (field, value) => {
        setMultiObject(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setMultiObjectErrors(prev => ({ ...prev, [field]: errs }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))
        
        const formData = action !== "create"
            ? { id: multiObject.id, ...formEntries }
            : { ...formEntries };

        try {
            setIsLoading(true)

            let response

            switch (entity){
                case "category": response = await getCategories(); break
                case "type": response = await getMaintenanceTypes(); break
                default: response = await getMaintenanceProviders(); break
            }

            const responseData = response.data

            const exists = responseData.find(
                (u) => u.name.trim().toLowerCase() === formData.name.trim().toLowerCase()
            )
            
            if (exists && (action === "create" || exists.id !== formData.id)) {
                setMultiObjectErrors((prev) => ({
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
            console.log(error)
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

        setMultiObjectErrors({ name: []});
        setMultiObject(formData)
        handleSubmit(formData)
    }

    let label

    switch(action){
        case "create": label = "Registrar"; break
        case "update": label = "Actualizar"; break
        default: label = data?.status ? "Inhabilitar" : "Habilitar"; break
    }

    let icon

    switch (action){
        case "create": 
            switch (entity){
                case "category": icon = <TagAddFilled className="size-5"/>; break
                case "type": icon = <WrenchFilled className="size-5"/>; break
                default: icon = <PersonWrenchFilled className="size-5"/>; break
            }
            break
        case "update":
            switch (entity){
                case "category": icon = <TagEditFilled className="size-5"/>; break
                case "type": icon = <EditFilled className="size-5"/>; break
                default: icon = <EditFilled className="size-5"/>; break
            }
            break
        default:
            switch (entity){
                case "category": icon = data?.status ? <SubtractCircleFilled className="size-5"/> : <CheckmarkCircleFilled className="size-5"/>; break
                case "type": icon =  data?.status ? <SubtractCircleFilled className="size-5"/> : <CheckmarkCircleFilled className="size-5"/>; break
                default: icon =  data?.status ? <SubtractCircleFilled className="size-5"/> : <CheckmarkCircleFilled className="size-5"/>; break
            }
            break                    
    }

    const labels = {
        category: { 
            singular: 'categoría',
            article:  'la categoría',
            pronoun:  'a'
        },
        type: { 
            singular: 'tipo de mantenimiento',
            article:  'el tipo de mantenimiento',
            pronoun:  'o'
        },
        provider: { 
            singular: 'proveedor de mantenimiento',
            article:  'el proveedor de mantenimiento',
            pronoun:  'o'
        }
    }

    const { singular, article, pronoun } = labels[entity]

    let title, description

    switch (action) {
        case 'create':
            title = `Registrar ${singular}`
            description = `Una vez registrad${pronoun}, ${article} estará disponible para cualquier proceso.`
            break
        case 'update':
            title = `Actualizar ${singular}`
            description = `Por favor, verifica que el nombre de la ${singular} sea correcto antes de continuar.`
            break

        case 'read':
            title = `Detalles de ${article}`
            description = `Revisa la información completa de ${article}. Esta vista es sólo de lectura.`
            break

        default:
            const verb   = data?.status ? 'inhabilitar' : 'habilitar'
            const when   = data?.status 
            ? `Al inhabilitar ${article}, no estará disponible, pero podrás habilitarla nuevamente en cualquier momento.`
            : `Al habilitar ${article}, se restablecerá su disponibilidad con normalidad.`
            title = `¿Deseas ${verb} ${article}?`
            description = when
    }

    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (formData) => {
        let verb 

        switch (action){
            case "create": verb = "registró"; break
            case "update": verb = "actualizó"; break
            default: verb = formData.status ? "inhabilitó" : "habilitó"; break
        }

        try {
            setIsLoading(true)
            
            let response 

            switch (action){
                case "create": 
                    switch (entity){
                        case "category": response = await createCategory(formData); break
                        case "type": response = await createMaintenanceType(formData); break
                        default: response = await createMaintenanceProvider(formData); break
                    }
                    break
                case "update":
                    switch (entity){
                        case "category": response = await updateCategory(formData); break
                        case "type": response = await updateMaintenanceType(formData); break
                        default: response = await updateMaintenanceProvider(formData); break
                    }
                    break
                default:
                    switch (entity){
                        case "category": response = await changeStatusCategory(formData); break
                        case "type": response = await changeStatusMaintenanceType(formData); break
                        default: response = await changeStatusMaintenanceProvider(formData); break
                    }
                    break                    
            }   

            const success = response.type === "SUCCESS"
            
            addToast({
                title: success
                    ? `Se ${verb} a ${formData.name}`
                    : `No se ${verb} a ${formData.name}`,
                description: success ? `correctamente` : undefined,
                color: success ? "primary" : "danger",
                icon: success
                    ? <CheckmarkCircleFilled className="size-5"/>
                    : <DismissCircleFilled className="size-5"/>
            })

            if (success){onRefresh(); resetForm()}
        } catch (error){
            addToast({
                title: `No se ${verb} a ${formData.name}`,
                description: error.response.data?.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
        } finally {
            setIsLoading(false)
            onOpenChange(false)
        }
    }

    return (
        <>
            <Modal
                hideCloseButton
                size="md"
                radius="lg"
                isKeyboardDismissDisabled
                isDismissable={!(action === "create" || action === "update")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{wrapper: "overflow-hidden", backdrop: "bg-black/20"}}
                ref={targetRef} 
            >
                <ModalContent className="bg-background">
                    {(onClose) => (
                        <>
                        <ModalHeader {...moveProps} className="flex flex-col gap-2 pb-4 pt-4">
                            <div className="w-full flex justify-end">
                                <CloseButton onPress={onClose}/>     
                            </div>
                            <p className="text-lg font-bold text-center">{title}</p>
                        </ModalHeader>
                        <ModalBody className="py-0 gap-0">
                            <p className="text-sm font-normal pb-6 text-center">{description}</p>
                            <Form onSubmit={onSubmit} id="multi-crud-form" className="gap-6 flex flex-col">
                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Nombre</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{(multiObject.name.length) + (entity === "category" ? " / 100" : " / 50")}</p>
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
                                    maxLength={entity === "category" ? 100 : 50}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el nombre" : data.name}
                                    value={multiObject.name}
                                    onValueChange={(value) => handleInputChange('name', value)}
                                    isInvalid={multiObjectErrors.name.length > 0}
                                    endContent={multiObjectErrors.name.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {multiObjectErrors.name.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />
                            </Form>
                        </ModalBody>
                        <ModalFooter className="flex justify-center pt-4 pb-8">
                            {action !== "read" && (
                                <>
                                <Button
                                    className="bg-transparent"
                                    radius="sm"
                                    startContent={<DismissFilled className="size-5"/>}
                                    onPress={() => {onClose(); resetForm()}}
                                >
                                    Cancelar
                                </Button>
                                
                                <Button
                                    className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                    form="multi-crud-form"
                                    radius="sm"
                                    variant="shadow"
                                    color="primary"
                                    type="submit"
                                    startContent={!isLoading && icon}
                                    isLoading={isLoading}
                                    isDisabled={multiObject.name === "" || multiObjectErrors.name.length > 0}
                                >
                                    {label}
                                </Button>
                                </>
                            )}
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}