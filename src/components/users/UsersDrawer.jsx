import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Form, Input, InputOtp, Select, SelectItem } from "@heroui/react"
import { CloseButton } from "../CloseButton"
import { ArrowCircleRightFilled, ArrowRightFilled, CheckmarkFilled, ChevronDownFilled, DismissFilled, TextAsteriskFilled } from "@fluentui/react-icons"
import { useEffect, useState } from "react"
import { onlyLetters, required, validEmail, validPhone, validRoleId } from "../../validators/validators"
import { PrimaryButton } from "../PrimaryButton"

export const UsersDrawer = ({isOpen, onOpenChange, data, action}) => {
    const [user, setUser] = useState({
        id: data?.id || "",
        name: data?.name || "",
        email: data?.email || "",
        position: data?.position || "",
        phone: data?.phone || "",
        roleId: data?.roleId || "",
    })

    const [userErrors, setUserErrors] = useState({ 
        name: [],
        email: [],
        position: [],
        phone: [],
        roleId: [],
    })

    useEffect(() => {
        setUser({
            id: data?.id || "",
            name: data?.name || "",
            email: data?.email || "",
            position: data?.position || "",
            phone: data?.phone || "",
            roleId: data?.roleId || "",
        })

        setUserErrors({
            name: [],
            email: [],
            position: [],
            phone: [],
            roleId: [],
        })
    }, [data]);

    const validators = {
        name: [required, onlyLetters],
        email: [validEmail],
        position: [required, onlyLetters],
        phone: [validPhone],
        roleId: [validRoleId],
    }

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const handleInputChange = (field, value) => {
        setUser(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setUserErrors(prev => ({ ...prev, [field]: errs }))
    }

    let title
    let description

    switch (action) {
        case "create":
            title = "Registrar usuario"
            description = "Ingrese la información solicitada para poder registrar un nuevo usuario."
            break
        case "update":
            title = "Actualizar usuario"
            description = "Edite la información necesaria y guarde los cambios para actualizar el usuario."
            break
        default:
            title = "Detalles del usuario"
            description = "Revise la información completa del usuario. Esta vista es solo de lectura."
            break
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const chars = "0123456789abcdefghakshSNUAI2425NYfijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const passwordLength = 12
        let password = ""

        for (let i = 0; i <= passwordLength; i++) {
            let randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber + 1);
        }

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))

        
        let data

        if(action !== "create"){
            data = {
                id: user?.id,
                ...formEntries
            }
        } else {
            data = {
                password: password,
                ...formEntries
            }
        }

        alert(JSON.stringify(data, null, 2))
    }

    return (
        <>
            <Drawer
                hideCloseButton
                size="sm"
                radius="sm"
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
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
                        <DrawerBody className="[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary">
                            <Form onSubmit={onSubmit} id="user-form" className="gap-6 flex flex-col">
                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Nombre</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{user.name.length + " / 50"}</p>
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
                                    maxLength={50}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el nombre del usuario" : data.name}
                                    value={user.name}
                                    onValueChange={(value) => handleInputChange('name', value)}
                                    isInvalid={userErrors.name.length > 0}
                                    endContent={userErrors.name.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {userErrors.name.map((error, i) => (
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
                                            <p className="!text-background-500 text-xs font-normal">{user.email.length + " / 50"}</p>
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
                                    placeholder={action === "create" ? "Ingrese el correo electrónico del usuario" : data.email}
                                    value={user.email}
                                    onValueChange={(value) => handleInputChange('email', value)}
                                    isInvalid={userErrors.email.length > 0}
                                    endContent={userErrors.email.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {userErrors.email.map((error, i) => (
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
                                                <p className="font-medium text-sm">Puesto</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{user.position.length + " / 50"}</p>
                                        </div>
                                    }
                                    autoComplete="organization-title"
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="position"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={50}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el puesto del usuario" : data.position}
                                    value={user.position}
                                    onValueChange={(value) => handleInputChange('position', value)}
                                    isInvalid={userErrors.position.length > 0}
                                    endContent={userErrors.position.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {userErrors.position.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Rol</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Rol"
                                    className="w-full -mt-4"
                                    name="roleId"
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
                                    placeholder="Selecciona un rol"
                                    radius="sm"
                                    selectedKeys={new Set([`${user.roleId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('roleId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={userErrors.roleId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {userErrors.roleId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    <SelectItem key="3">Operador</SelectItem>
                                    <SelectItem key="2">Supervisor</SelectItem>
                                    <SelectItem key="1">Administrador</SelectItem>
                                </Select>

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Teléfono</p>
                                    </div>
                                    <p className="!text-background-500 text-xs font-normal pr-2.5">{user.phone.length + " / 10"}</p>
                                </div>
                                <InputOtp
                                    autoComplete="tel"
                                    variant="bordered"
                                    color="primary"
                                    classNames={{segment: "w-full min-w-0 rounded-lg bg-background-100 text-current border-background-100", segmentWrapper: "w-full", base: "w-full data-[invalid=true]:animate-shake"}}
                                    className="-mt-6"
                                    name="phone"
                                    length={10} 
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action !== "create" ? data.phone : undefined}
                                    value={user.phone}
                                    onValueChange={(value) => handleInputChange('phone', value)}
                                    isInvalid={userErrors.phone.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {userErrors.phone.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />
                            </Form>
                        </DrawerBody>
                        <DrawerFooter className="flex justify-end py-8">
                            {(action === 'create' || action === 'update') && (
                                <Button
                                    className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                    form="user-form"
                                    radius="sm"
                                    variant="shadow"
                                    color="primary"
                                    type="submit"
                                    endContent={<ArrowRightFilled className="size-5"/>}
                                    isDisabled={user.name === "" || user.email === "" || user.position === "" || user.roleId === "" || userErrors.name.length > 0 || userErrors.email.length > 0 || userErrors.position.length > 0 || userErrors.roleId.length > 0 || userErrors.phone.length > 0}
                                >
                                    Siguiente
                                </Button>
                            )}
                        </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}