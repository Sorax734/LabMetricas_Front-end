import { Button, Form, Input } from "@heroui/react";
import { ThemeSwitcher } from "../components/ThemeSwitcher"
import { useIsIconOnly } from "../hooks/useIsIconOnly";
import { ArrowLeftStartOnRectangleIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { PrimaryButton } from "../components/PrimaryButton"
import { use, useState } from "react";
import { Checkmark12Filled, Dismiss12Filled, TextAsterisk16Filled } from "@fluentui/react-icons";
import { SecondaryButton } from "../components/SecondaryButton";

export const Profile = () => {
    const isIconOnly = useIsIconOnly()
   
    const user = {
        id: 17,
        name: "Diego",
        lastName: "Amador",
        email: "amadorcdr@gmail.com",
        phone: "7772991476"
    }

    const [submitted, setSubmitted] = useState(null);
    const [name, setName] = useState(user.name);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const nameErrors = [];
    const lastNameErrors = [];
    const emailErrors = [];

    const onSubmit = (e) => {
        e.preventDefault();
        const formEntries = Object.fromEntries(new FormData(e.currentTarget));

        const data = {
            id: user.id,
            ...formEntries
        };

        setSubmitted(data);
        alert(JSON.stringify(data, null, 2));
    };

    if (name.length === 0){
        nameErrors.push("El campo es obligatorio.")
    }

    if (name.length > 0 && !name.match(/^\p{L}+(?:\s\p{L}+)*$/u)){
        nameErrors.push("No se permiten números, símbolos, ni espacios al inicio o final.")
    }

    if (lastName.length === 0){
        lastNameErrors.push("El campo es obligatorio.")
    }

    if (lastName.length > 0 && !lastName.match(/^\p{L}+(?:\s\p{L}+)*$/u)){
        lastNameErrors.push("No se permiten números, símbolos, ni espacios al inicio o final.")
    }

    if (email.length === 0){
        emailErrors.push("El campo es obligatorio.")
    }
      
    if (email.length > 0 && !email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)){
        emailErrors.push("Ingresa una dirección de correo electrónico valida.")
    }

    const isDisabled = emailErrors.length > 0 || nameErrors.length > 0 || lastNameErrors.length > 0


    return (
        <>
            <div className="w-full h-full">
                <div className="p-8 sm:px-12 w-full h-full">
                    <div className="flex justify-between pb-10">
                        <div className="flex flex-col gap-1">
                            <p className='lg:text-3xl text-2xl font-bold'>Mi perfil</p>
                        </div>                        
                        <div>
                            <ThemeSwitcher isIconOnly={isIconOnly}/>
                        </div>
                    </div>
                
                    <Form className="gap-6" onSubmit={onSubmit}>
                        <div className="grid flex-col gap-6 items-center w-full h-full">
                            <div className="grid xs:grid-cols-2 gap-6">
                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p>Nombre</p>
                                                <TextAsterisk16Filled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs">{name.length + " / 40"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current", input: "group-data-[invalid=true]:!text-current font-medium",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-background-100 text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="name"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={40}
                                    placeholder={user.name}
                                    value={name}
                                    onValueChange={setName}
                                    isInvalid={nameErrors.length > 0}
                                    endContent={nameErrors.length === 0 ? <Checkmark12Filled className='size-5 text-background-500 group-data-[focus=true]:text-primary' /> : <Dismiss12Filled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {nameErrors.map((error, i) => (
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
                                                <p>Apellido</p>
                                                <TextAsterisk16Filled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs">{lastName.length + " / 40"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current", input: "group-data-[invalid=true]:!text-current font-medium",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-background-100 text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="lastName"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={40}
                                    placeholder={user.lastName}
                                    value={lastName}
                                    onValueChange={setLastName}
                                    isInvalid={lastNameErrors.length > 0}
                                    endContent={lastNameErrors.length === 0 ? <Checkmark12Filled className='size-5 text-background-500 group-data-[focus=true]:text-primary' /> : <Dismiss12Filled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {lastNameErrors.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />
                            </div>

                            <Input
                                label={
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-1">
                                            <p>Correo electrónico</p>
                                            <TextAsterisk16Filled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                        </div>
                                        <p className="!text-background-500 text-xs">{email.length + " / 100"}</p>
                                    </div>
                                }
                                classNames={{ label: "w-full font-medium !text-current", input: "group-data-[invalid=true]:!text-current font-medium",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-background-100 text-current" }}
                                className="w-full"
                                color="primary"
                                name="email"
                                labelPlacement="outside"
                                type="email"
                                radius="sm"
                                size="md"
                                variant="bordered"
                                maxLength={100}
                                placeholder={user.email}
                                value={email}
                                onValueChange={setEmail}
                                isInvalid={emailErrors.length > 0}
                                endContent={emailErrors.length === 0 ? <Checkmark12Filled className='size-5 text-background-500 group-data-[focus=true]:text-primary' /> : <Dismiss12Filled className='size-4 text-danger' /> }
                                errorMessage={() => (
                                    <div className="flex text-danger">
                                        <ul>
                                            {emailErrors.map((error, i) => (
                                                <li key={i}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            />
                        </div>
                        
                        <PrimaryButton 
                            isSubmit={true} 
                            isDisabled={isDisabled} 
                            label="Guardar"
                        />
                    </Form>

               { /*    <SecondaryButton
                        label="Cerrar sesión"
                        onPress={() => alert("Cerraste sesión")}
                        startContent={<ArrowLeftStartOnRectangleIcon className='size-5' />}
                    />*/}
                </div>
            </div>
        </>
    );
}