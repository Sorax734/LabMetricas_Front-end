import { addToast, Spinner as SpinnerH, Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input, Pagination, Popover, PopoverContent, PopoverTrigger, ScrollShadow, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, user, Alert, Chip } from "@heroui/react"
import { getUsers } from "../service/user"
import { Spinner } from "../components/Spinner"
import { PrimaryButton } from "../components/PrimaryButton"
import { SecondaryButton } from "../components/SecondaryButton"
import React, { useEffect, useState, useTransition } from "react"
import { useIsIconOnly } from "../hooks/useIsIconOnly"
import { ArrowSortDownLinesFilled, ArrowSortFilled, ArrowSortUpLinesFilled, ChevronDownFilled, CircleFilled, DataFunnelFilled, DismissCircleFilled, EmojiSadFilled, FilterFilled, InfoFilled, OptionsFilled, PersonAddFilled, PersonAvailableFilled, PersonDeleteFilled, PersonDesktopFilled, PersonEditFilled, PersonInfoFilled, PersonSubtractFilled, PersonWrenchFilled, SearchFilled, TextSortAscendingFilled, TextSortDescendingFilled } from "@fluentui/react-icons"
import { motion } from "framer-motion"
import { useOutletContext } from "react-router-dom"
import { Tooltip } from "../components/Tooltip"

export const Users = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(false)

    const [users, setUsers] = useState([])
    const [errors, setErrors] = useState([])

    const [isPending, startTransition] = useTransition()
    const {searchValue /*, setSearchValue */} = useOutletContext()

    const [selectedUser, setSelectedUser] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                const response = await getUsers()
                const data = response.data
                
                if (data) {
                    const dataCount = data.map((item, index) => ({
                        ...item,
                        n: index + 1,
                        status: item.status ? "activo" : "inactivo"
                    }))
                    
                    startTransition(() => {
                        setUsers(dataCount)
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
    
    const INITIAL_VISIBLE_COLUMNS = ["n", "name", "role", "status", "email", "actions"]

    const columns = [
        {name: "N", uid: "n", sortable: true},
        {name: "Correo", uid: "email", sortable: true},
        {name: "Nombre", uid: "name", sortable: true},
        {name: "Cargo", uid: "role", sortable: true},
        {name: "Status", uid: "status"},
        {name: "Acciones", uid: "actions"},
    ]
    
    const statusOptions = [
        {name: "Activo", uid: "activo"},
        {name: "Inactivo", uid: "inactivo"},
    ]
    
    function capitalize(s) {
        return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ""
    }

    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))

    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS))

    const [statusFilter, setStatusFilter] = React.useState("all")

    const [rowsPerPage, setRowsPerPage] = React.useState(10)

    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "n",
        direction: "ascending",
    })

    const [page, setPage] = React.useState(1)

    useEffect(() => {
        setPage(1)
    }, [searchValue, statusFilter])

    const hasSearchFilter = Boolean(searchValue)

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns
        
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid))
    }, [visibleColumns])
    
    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users]
    
        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(searchValue.toLowerCase()),
            )
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.status),
            )
        }
    
        return filteredUsers
    }, [users, searchValue, statusFilter])

    const pages = Math.ceil(filteredItems.length / rowsPerPage)
    
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return filteredItems.slice(start, end)
    }, [page, filteredItems, rowsPerPage])
    
    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0
        
            return sortDescriptor.direction === "descending" ? -cmp : cmp
        })
    }, [sortDescriptor, items])

    const paginatedSortedItems = React.useMemo(() => {
        return sortedItems.map((user, idx) => ({
            ...user,
            pageIndex: idx,    // idx va de 0 a (rowsPerPage - 1)
        }))
    }, [sortedItems])

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value))
        setPage(1)
    }, [])
    
    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value)
            setPage(1)
        } else {
            setFilterValue("")
        }
    }, [])

    const handleSort = (key) => {
        setSortDescriptor((prev) => ({
            column: key,
            direction:
                prev.column === key
                ? prev.direction === "ascending"
                    ? "descending"
                    : "ascending"
                : "ascending",
            })
        )
    }

    const endContent = (key) => {
        const endContent = sortDescriptor.column === key
            ? sortDescriptor.direction === "ascending"
                ? <ArrowSortUpLinesFilled className="size-5" />
                : <ArrowSortDownLinesFilled className="size-5" />
            : null     

        return endContent
    }
    
    const handleCreateUser = () => {
        addToast({
            title: "handleCreateUser",
            color: "primary"
        })
    }

    const handleReadUser = (user) => {
        setSelectedUser(user)
        addToast({
            title: "handleReadUser",
            description: JSON.stringify(user, null, 2),
            color: "primary"
        })
    }

    const handleUpdateUser = (user) => {
        setSelectedUser(user)
        addToast({
            title: "handleUpdateUser",
            description: JSON.stringify(user, null, 2),
            color: "primary"
        })
    }

    const handleChangeStatusUser = (user) => {
        setSelectedUser(user)
        addToast({
            title: "handleChangeStatusUser",
            description: JSON.stringify(user, null, 2),
            color: "primary"
        })
    }

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey]

        switch (columnKey) {
            case "n": 
                return (
                    <p className="font-medium">{cellValue}</p>
                )
            case "role": 
                return (
                    capitalize(cellValue)
                )
            case "status":
                return (
                    <Tooltip
                        tooltipContent="Cambiar status"
                        tooltipPlacement="top"
                    >
                        <Button
                            {...(cellValue === "activo" && { color: "primary", variant: "light" })}
                            className={cellValue === "activo" ? "text-sm font-medium" : "bg-transparent data-[hover=true]:bg-background-300/20 text-background-700 text-sm font-medium"}
                            size="sm"
                            radius="sm"
                            startContent={cellValue === "activo" ? <PersonAvailableFilled className="size-5"/> : <PersonSubtractFilled className="size-5"/>}
                            onPress={() => handleChangeStatusUser(user)}
                        >
                            {capitalize(cellValue)}
                        </Button>
                    </Tooltip>
                )
            case "actions":
                return (
                    <div className="flex justify-center lg:gap-2">
                        <Tooltip
                            tooltipContent="Más detalles"
                            tooltipPlacement="top"
                        >
                            <Button
                                isIconOnly
                                className="text-sm"
                                color="primary"
                                variant="light"
                                size="sm"
                                radius="sm"
                                onPress={() => handleReadUser(user)}
                            >
                                <InfoFilled className="size-5"/>
                            </Button>
                        </Tooltip>

                        <Tooltip
                            tooltipContent="Actualizar usuario"
                            tooltipPlacement="top"
                        >
                            <Button
                                isIconOnly
                                className="text-sm"
                                color="primary"
                                variant="light"
                                size="sm"
                                radius="sm"
                                onPress={() => handleUpdateUser(user)}
                            >
                                <PersonEditFilled className="size-5"/>
                            </Button>
                        </Tooltip>                        
                    </div>
                )
            default:
                return cellValue
        }
    }, [])
    
    const topContent = React.useMemo(() => {
        const sortOptions = [
            { key: "n", label: "Número" },
            { key: "email", label: "Correo" },
            { key: "name", label: "Nombre" },
            { key: "role", label: "Cargo" },
        ]

        const totalFiltered = filteredItems.length
        const startIndex = (page - 1) * rowsPerPage + 1
        const endIndex = Math.min(page * rowsPerPage, totalFiltered)

        return (
            <div className="flex justify-between md:pb-2 lg:pb-4 gap-4 items-center px-2">
                <div className="flex flex-col">
                    <p className="lg:text-2xl text-lg font-bold">Usuarios</p>
                    <span className="text-background-500 text-xs">
                        {totalFiltered === 0
                        ? "Sin resultados"
                            : totalFiltered <= rowsPerPage
                            ? `Mostrando todos (${totalFiltered})`
                            : `Mostrando ${startIndex}–${endIndex} de ${totalFiltered}`}
                    </span>
                </div>

                <div className="flex sm:gap-4 gap-2">
                    <Select
                        disallowEmptySelection
                        closeOnSelect={false}
                        className="w-32 flex-none hidden md:flex"
                        aria-label="Select para eliminar o agregar columnas"
                        renderValue={() => <p className="font-medium">Columnas</p>}
                        size="md"
                        radius="sm"
                        selectionMode="multiple"
                        defaultSelectedKeys={visibleColumns}
                        onSelectionChange={setVisibleColumns}
                        selectorIcon={<ChevronDownFilled className="size-5"/>}
                        classNames={{
                            trigger: "border-0 shadow-none !bg-background-100 transition-colors duration-1000 ease-in-out",
                            popoverContent: "text-current bg-background transition-colors duration-1000 ease-in-out rounded-lg", 
                        }}
                        listboxProps={{
                            itemClasses: {
                                base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                            }
                        }}
                    >
                        {columns.map((column) => (
                            <SelectItem key={column.uid} value={column.uid}>
                                {capitalize(column.name === "N" ? "número" : column.name)}
                            </SelectItem>
                        ))}
                    </Select>

                    <Popover placement="bottom" shadow="lg" radius="sm">
                        <PopoverTrigger>
                            <Button
                                className="bg-background-100 transition-background !duration-1000 ease-in-out"
                                isIconOnly
                                radius="sm"
                            >
                                <OptionsFilled className="size-5"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-background transition-colors duration-1000 ease-in-out w-32">
                            <div className="p-1 flex flex-col items-start w-full h-full">
                                <p className="text-xs text-background-500 pt-1 pb-1">Opciones</p>
                                
                                <Popover placement="left-start" shadow="lg" radius="sm" crossOffset={-32} offset={11}>
                                    <PopoverTrigger>
                                        <Button
                                            className="bg-transparent -ml-2 px-3"
                                            disableAnimation
                                            radius="sm"
                                            endContent={<ArrowSortFilled className="ml-3 size-4"/>}
                                        >
                                            Ordenar
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="bg-background transition-colors duration-1000 ease-in-out w-32">
                                        <div className="p-1 flex flex-col items-start w-full h-full">
                                            <p className="text-xs text-background-500 pt-1 pb-1">Ordenar por:</p>
                                            
                                            {sortOptions.map(opt => (
                                                <Button
                                                    disableRipple
                                                    radius="sm"
                                                    size="sm"
                                                    key={opt.key}
                                                    className="!bg-transparent text-sm -ml-2 py-5"
                                                    onPress={() => handleSort(opt.key)}
                                                    endContent={endContent(opt.key)}
                                                >
                                                {opt.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                <Select
                                    disallowEmptySelection
                                    className="w-28 flex-none"
                                    aria-label="Select filas"
                                    renderValue={(items) => {
                                        const selectedKey = items.values().next().value?.key
                                        return <p>Filas: {selectedKey}</p>}
                                    }
                                    size="md"
                                    radius="sm"
                                    selectionMode="single"
                                    defaultSelectedKeys={[`${rowsPerPage}`]}
                                    onChange={onRowsPerPageChange}
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    classNames={{
                                        trigger: "border-0 shadow-none !bg-transparent -ml-2",
                                        popoverContent: "text-current bg-background transition-colors duration-1000 ease-in-out rounded-lg",
                                    }}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                >
                                    <SelectItem key="5" value="5">5</SelectItem >
                                    <SelectItem key="10" value="10">10</SelectItem>
                                    <SelectItem key="15" value="15">15</SelectItem >
                                    <SelectItem key="20" value="20">20</SelectItem >
                                </Select>

                                <Select
                                    disallowEmptySelection
                                    className="w-28 flex-none"
                                    aria-label="Select status"
                                    renderValue={() => <p>Status</p>}
                                    size="md"
                                    radius="sm"
                                    selectionMode="multiple"
                                    selectedKeys={statusFilter}
                                    onSelectionChange={setStatusFilter} 
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    classNames={{
                                        trigger: "border-0 shadow-none !bg-transparent -ml-2",
                                        popoverContent: "text-current bg-background transition-colors duration-1000 ease-in-out rounded-lg",
                                    }}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status.uid}>
                                            {capitalize(status.name)}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <PrimaryButton
                        tooltipPlacement="bottom"
                        label="Registrar"
                        startContent={<PersonAddFilled className="size-5"/>}
                        onPress={() => handleCreateUser()}
                    />
                </div>
            </div>
        )
    }, [
        filteredItems,
        searchValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        rowsPerPage,
        onRowsPerPageChange,
        page,
        users.length,
        hasSearchFilter,
        sortDescriptor
    ])
    
    const bottomContent = React.useMemo(() => {
        if (filteredItems.length > 0){
            return (
                <div className="flex justify-between px-2">
                    <Pagination
                        showControls
                        showShadow
                        aria-label="Pagination tabla"
                        radius="sm"
                        variant="light"
                        color="primary"
                        page={page}
                        total={pages || 1}
                        onChange={setPage}
                        classNames={{ cursor: "font-medium", wrapper: "gap-0 sm:gap-1" }}
                    />
                </div>
            )
        }
    }, [filteredItems.length, page, pages])

    const classNames = React.useMemo(
        () => ({
            th: "px-2 font-medium text-sm text-current bg-background-100 hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
            td: [
            "px-1 py-2",
                // changing the rows border radius
                // first
                "group-data-[first=true]/tr:first:before:rounded-none",
                "group-data-[first=true]/tr:last:before:rounded-none",
                // middle
                "group-data-[middle=true]/tr:before:rounded-none",
                // last
                "group-data-[last=true]/tr:first:before:rounded-none",
                "group-data-[last=true]/tr:last:before:rounded-none",
            ],
            wrapper: "overflow-y-auto overflow-x-auto pt-0 pb-3 pl-0 md:pr-2 pr-0 transition-colors duration-1000 bg-background [&::-webkit-scrollbar-corner]:bg-transparent [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary", // Ajuste principal
            base: "h-full",
            table: "bg-transparent",
            emptyWrapper: "text-background-950 text-sm"
        }), [],
    )

    return (
        <>
            {isLoading ? (
                <div className="px-2 w-full h-full">
                    <div className="flex flex-col">
                        <p className="lg:text-2xl text-lg font-bold">Usuarios</p>
                        <span className="text-background-500 text-xs">Cargando usuarios</span>
                    </div>
                    
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
                <div className="px-2 w-full h-full">
                    <div className="flex flex-col">
                        <p className="lg:text-2xl text-lg font-bold">Usuarios</p>
                        <span className="text-background-500 text-xs">Error al cargar los usuarios</span>
                    </div>
                    <div className="space-y-4 pt-4">
                        {errors.map((msg, i) => (
                        <motion.div
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
            ) : ( users.length > 0 && (
                <>
                    <Table
                        isHeaderSticky
                        className="hidden md:flex"
                        radius="sm"
                        shadow="none"
                        aria-label="Tabla de usuarios en pantallas medianas o superiores"
                        topContentPlacement="outside"
                        bottomContentPlacement="inside"
                        topContent={topContent}
                        bottomContent={bottomContent}
                        classNames={classNames}
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                    >
                        <TableHeader columns={headerColumns} className="bg-transparent">
                            {(column) => (
                                <TableColumn
                                    key={column.uid}
                                    align={column.uid === "actions" || column.uid === "n" || column.uid === "status" ? "center" : "start"}
                                    allowsSorting={column.sortable}
                                >
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>

                        <TableBody
                            className="bg-transparent" 
                            items={paginatedSortedItems}
                            emptyContent={ filteredItems.length > 0 ? 
                                <SpinnerH 
                                    classNames={{ label: "pt-2 text-sm font-medium" }} 
                                    color="current" 
                                    size="md" 
                                    label="Espere un poco por favor" 
                                /> : 
                                "No se encontraron coincidencias"
                            }>
                            {(item) => (
                                <TableRow aria-label={item.n} key={item.n}>
                                    {(columnKey) => 
                                    <TableCell>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: item.pageIndex * 0.1 }}
                                        >
                                            {renderCell(item, columnKey)}
                                        </motion.div>
                                    </TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <Table
                        hideHeader
                        className="md:hidden"
                        shadow="none"
                        aria-label="Tabla de usuarios en pantallas pequeñas o inferiores"
                        topContentPlacement="outside"
                        bottomContentPlacement="inside"
                        topContent={topContent}
                        bottomContent={bottomContent}
                        classNames={classNames}
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                    >
                        <TableHeader className="bg-transparent">
                            <TableColumn key="card" hideHeader />
                        </TableHeader>

                        <TableBody
                            className="bg-transparent" 
                            items={paginatedSortedItems}
                            emptyContent={ filteredItems.length > 0 ? 
                                <SpinnerH 
                                    classNames={{ label: "pt-2 text-sm font-medium" }} 
                                    color="current" 
                                    size="md" 
                                    label="Espere un poco por favor" 
                                /> : 
                                "No se encontraron coincidencias"
                            }>
                            {(item) => (
                                <TableRow aria-label={item.n} key={item.n}>
                                    <TableCell>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: item.pageIndex * 0.1 }}
                                        >
                                            <Card shadow="sm" isPressable onPress={() => handleReadUser(item)} className="w-full transition-colors !duration-1000 ease-in-out bg-background dark:bg-background-100" radius="sm">
                                                <CardBody>
                                                    <div className={`absolute top-0 bottom-0 left-0 w-1 ${item.status === "activo" ? "bg-primary" : "bg-background-700"} rounded-full`}></div>
                                                    
                                                    <div className="w-full h-full flex justify-between">
                                                        <div>
                                                            <div className="xs:flex xs:items-center xs:gap-2">
                                                                <div className="flex gap-1 pb-1 items-end">
                                                                    <p className="text-sm font-medium break-all line-clamp-1">{item.name}</p>
                                                                </div>
                                                                <div className={`flex gap-1 text-xs items-start ${item.status === "activo" ? "text-primary" : "text-background-700"}`}>
                                                                    <p className="text-background-950">{capitalize(item.role)}</p>
                                                                    <p>{item.status}</p>
                                                                    <p className="text-xs text-background-500 pb-[2px]">#{item.n}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">{item.email}</p>
                                                        </div>

                                                        <div className="flex gap-2 items-center pl-2">
                                                            <Tooltip
                                                                tooltipContent="Cambiar status"
                                                                tooltipPlacement="top"
                                                            >
                                                                <Button
                                                                    { ...(item.status === "activo" && { color: "secondary", variant: "flat" }) }
                                                                    className={ item.status === "activo" ? "" : "bg-background-300/20 text-background-700"}
                                                                    isIconOnly
                                                                    as="a"
                                                                    size="md"
                                                                    radius="sm"
                                                                    onPress={() => handleChangeStatusUser(item)}
                                                                >
                                                                    {item.status === "activo" ? <PersonAvailableFilled className="size-5"/> : <PersonSubtractFilled className="size-5"/>}
                                                                </Button>
                                                            </Tooltip>

                                                            <SecondaryButton
                                                                label="Actualizar usuario"
                                                                tooltipPlacement="top"
                                                                startContent={<PersonEditFilled className="size-5"/>}
                                                                isIconOnly={true}
                                                                onPress={() => handleUpdateUser(item)}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </motion.div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </> )
            ))}
        </>
    )
}