import { Button, Input, Pagination, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { getUsers } from "../service/user";
import { Spinner } from "../components/Spinner";
import { PrimaryButton } from "../components/PrimaryButton";
import React, { useEffect, useState } from "react";
import { useIsIconOnly } from "../hooks/useIsIconOnly";
import { DataFunnelFilled, FilterFilled, PersonAddFilled, SearchFilled } from "@fluentui/react-icons";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [error, setError] = useState(null);
    const isIconOnly = useIsIconOnly()

    const INITIAL_VISIBLE_COLUMNS = ["indice", "name", "lastname", "role", "status", "email", "actions"];

    const columns = [
        {name: "Índice", uid: "indice", sortable: true},
        {name: "Correo", uid: "email", sortable: true},
        {name: "Nombre", uid: "name", sortable: true},
        {name: "Apellido", uid: "lastname", sortable: true},
        {name: "Cargo", uid: "role", sortable: true},
        {name: "Status", uid: "status"},
        {name: "Acciones", uid: "actions"},
    ];    
    
    const statusOptions = [
        {name: "Activo", uid: "activo"},
        {name: "Inactivo", uid: "inactivo"},
    ];
    
    function capitalize(s) {
        return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUsers();
                const data = response.data
                
                if (data) {
                    const dataCount = data.map((item, index) => ({
                        ...item,
                        indice: index + 1,
                        status: item.status ? "activo" : "inactivo"
                    }));
                    setUsers(dataCount);
                } else {
                    setError("No se pudieron obtener los datos");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [refreshTrigger]);
    
    const [filterValue, setFilterValue] = React.useState("");

    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));

    const [statusFilter, setStatusFilter] = React.useState("all");

    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "indice",
        direction: "ascending",
    });
    
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);
    
    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];
    
        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.status),
            );
        }
    
        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);
    
    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
        
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);
    
    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "indice": 
                return (
                    cellValue
                );
            case "name":
                return (
                    cellValue
                );
            case "email":
                return (
                    <p>{cellValue}</p>
                );
            case "status":
                return (
                    cellValue
                );
            case "actions":
                return (
                <div>
                    acciones
                </div>
                );
            default:
                return cellValue;
        }
    }, []);
    
    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);
    
    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);
    
    const topContent = React.useMemo(() => {
        return (
            <div className="flex justify-between pb-4">
                <p className="lg:text-2xl text-lg font-bold">Usuarios</p>
                    <div className="flex gap-3">
                        <Input
                            classNames={{ input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal", mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                            className="w-[240px]"
                            color="primary"
                            name="search"
                            labelPlacement="inside"
                            type="text"
                            radius="sm"
                            size="md"
                            variant="bordered"
                            maxLength={100}
                            value={filterValue}
                            onValueChange={onSearchChange}
                            placeholder="Buscar usuarios por nombre..."
                            endContent={<SearchFilled className='size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger' />}
                        />

                        <Popover placement="bottom-end" className="bg-background transition-colors duration-1000 ease-in-out"
                            offset={17} shadow="lg" radius="sm"
                        >
                            <PopoverTrigger>
                                <Button 
                                    radius="sm"
                                    className="bg-background-100 transition-colors !duration-1000 ease-in-out"
                                    isIconOnly
                                >
                                    <FilterFilled className="size-5"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="flex flex-col items-start bg-background">
                                <Select
                                    size="sm"
                                    radius="sm"
                                    aria-label="Select filas"
                                    disallowEmptySelection
                                    className="w-36"
                                    selectionMode="single"
                                    defaultSelectedKeys={["10"]}
                                    onChange={onRowsPerPageChange}
                                    renderValue={(items) => {
                                        const selectedKey = items.values().next().value?.key;
                                        return <p>Filas: {selectedKey}</p>;}
                                    }
                                    classNames={{
                                        trigger: "border-0 shadow-none !bg-transparent data-[hover=true]:!bg-background-100 transition-colors duration-1000 ease-in-out",
                                        popoverContent: "text-current bg-background transition-colors duration-1000 ease-in-out rounded-lg", // Estilo para el popover
                                        //value: "text-primario-500 font-bold" // Estilo para el valor seleccionado
                                    }}
                                    popoverProps={{
                                        placement: "left-start",
                                        offset: 17,
                                        crossOffset: -4
                                    }}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}>
                                    <SelectItem key="5" value="5"  className="capitalize bg-background text-current">5</SelectItem >
                                    <SelectItem key="10" value="10"  className="capitalize bg-background text-current">10</SelectItem>
                                    <SelectItem key="15" value="15" className="capitalize bg-background text-current">15</SelectItem >
                                    <SelectItem key="20" value="20" className="capitalize bg-background text-current">20</SelectItem >
                                </Select>

                                <Select
                                    size="sm"
                                    radius="sm"
                                    aria-label="Select filtro por status"
                                    disallowEmptySelection
                                    className="w-36"
                                    selectionMode="multiple"
                                    closeOnSelect={false}
                                    selectedKeys={statusFilter}
                                    renderValue={() => <p>Status</p>}
                                    onSelectionChange={setStatusFilter} 
                                    classNames={{
                                        trigger: "border-0 shadow-none !bg-transparent data-[hover=true]:!bg-background-100 transition-colors duration-1000 ease-in-out",
                                        popoverContent: "text-current bg-background transition-colors duration-1000 ease-in-out rounded-lg", // Estilo para el popover
                                        //value: "text-primario-500 font-bold" // Estilo para el valor seleccionado
                                    }}
                                    popoverProps={{
                                        placement: "left-end",
                                        offset: 17,
                                        crossOffset: 14
                                    }}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status.uid}  className="capitalize bg-background text-current">
                                            {capitalize(status.name)}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    size="sm"
                                    radius="sm"
                                    aria-label="Select columnas"
                                    disallowEmptySelection
                                    className="w-36"
                                    selectionMode="multiple"
                                    closeOnSelect={false}
                                    defaultSelectedKeys={visibleColumns}
                                    renderValue={() => <p>Columnas</p>}
                                    onSelectionChange={setVisibleColumns}
                                    classNames={{
                                        trigger: "border-0 shadow-none !bg-transparent data-[hover=true]:!bg-background-100 transition-colors duration-1000 ease-in-out",
                                        popoverContent: "text-current bg-background transition-colors duration-1000 ease-in-out rounded-lg", // Estilo para el popover
                                        //value: "text-primario-500 font-bold" // Estilo para el valor seleccionado
                                    }}
                                    popoverProps={{
                                        placement: "left",
                                        offset: 17,
                                        crossOffset: 42
                                    }}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}>
                                    {columns.map((column) => (
                                        <SelectItem key={column.uid} className="capitalize bg-transparent text-current" value={column.uid}>
                                            {capitalize(column.name)}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </PopoverContent>
                        </Popover>

                        <PrimaryButton
                            label="Registrar usuario"
                            startContent={<PersonAddFilled className="size-5"/>}
                            isIconOnly={isIconOnly}
                            onPress={() => alert("Se desplegará un drawer para registrar a los usuarios")}
                        />
                            {/*
                        <Button 
                            aria-label="Button registrar"
                            onPress={handleOpenCreate}
                            className="font-bold"
                            size="md"
                            radius="md"
                            variant="ghost"
                            color="primary"
                            startContent={<UserPlus strokeWidth={2} className="w-5 h-5"/>}>
                            Registrar checador
                        </Button>
                        */}
                    </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        users.length,
        hasSearchFilter,
    ]);
    
    const bottomContent = React.useMemo(() => {
        return (
            <div className="flex justify-between items-center">
                <Pagination
                    aria-label="Pagination tabla"
                    showControls
                    showShadow
                    classNames={{ cursor: "font-medium" }}
                    color="primary"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages || 1}
                    variant="light"
                    onChange={setPage}
                />
                <div className="flex flex-col justify-end items-end">
                    {/**<span className="text-text-500 text-xs pb-2">
                    {selectedKeys === "all"
                        ? "Todos seleccionados"
                        : `${selectedKeys.size} de ${items.length} seleccionados`}
                    </span> */}
                    <span className="text-background-500 text-sm pr-6">Total: {users.length} usuarios</span>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const classNames = React.useMemo(
        () => ({
            th: "font-medium text-sm text-background hover:!text-primary-200 bg-primary",
            td: [
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
            wrapper: "max-h-full max-w-full overflow-y-auto overflow-x-auto px-2 bg-background-100/40 [&::-webkit-scrollbar]:sm:w-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-background-300", // Ajuste principal
            base: "h-[74vh] w-full",
            table: "w-full bg-transparent",
        }), [],
    );

    return (
        <>
            <Table
                isHeaderSticky
                aria-label="Table checkers"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={classNames}
                selectedKeys={selectedKeys}
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}>

                <TableHeader columns={headerColumns} className="bg-transparent">
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                        {column.name}
                        </TableColumn>
                    )}
                </TableHeader>

                <TableBody
                    isLoading={loading}
                    loadingContent={<Spinner/>}
                    className="bg-transparent" 
                    emptyContent={ users.length === 0 ? "No tienes usuarios por ahora" : "No se encontraron usuarios :("} 
                    items={sortedItems}>
                    {(item) => (
                        <TableRow aria-label={item.indice} key={item.email}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}