import { addToast, Form, Input } from "@heroui/react";
import { Checkmark12Filled, Dismiss12Filled, DismissCircleFilled, EmojiHandFilled, TextAsterisk16Filled } from "@fluentui/react-icons";
import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { PrimaryButton } from "../components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export const Login = () => {
    const { login, user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Estado actual del usuario:", user)
        if (user && user.role) {
            console.log("Intentando redirigir con rol:", user.role)
            navigate("/App")

            addToast({
                title: "Bienvenido de vuelta usuario",
                description: "Su sesión se ha iniciado correctamente",
                color: "primary",
                icon: <EmojiHandFilled className='size-5' />
            })
        }
    }, [user, navigate]);

    const onSubmit = async (e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))
        
        try {
            setIsLoading(true);

            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include"
            });
            const result = await response.json()
            console.log("Respuesta del backend:", result)
            console.log("Datos del usuario recibidos:", result.data)
            
            if (result && result.data && result.data.roles && result.data.roles.length > 0) {
                // Extraer el rol del array de roles
                const userRole = result.data.roles[0].authority
                login({ 
                    email: result.data.user.email, 
                    role: userRole,
                    token: result.data.token 
                });
                setIsLoading(false);
            } else {
                addToast({
                    title: "Credenciales incorrectas",
                    description: result.message,
                    color: "danger",
                    icon: <DismissCircleFilled className='size-5' />
                })
                setIsLoading(false);
            }
        } catch (err) {
            console.log(err)
            addToast({
                title: "Error de conexión con el servidor",
                description: "Lo sentimos, ocurrió un error al realizar la petición al servidor",
                color: "danger",
                icon: <DismissCircleFilled className='size-5' />
            })
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="w-screen h-screen grid grid-cols-2">
                <div className="bg-background flex flex-col col-span-2 lg:col-span-1">
                    <div className="py-8 px-8">
                        <p className="text-lg font-bold">Nombre del sistema</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center -mt-20 items-center m-8">
                        <p className="lg:text-3xl text-2xl font-bold pb-4">Iniciar sesión</p>
                        <p className="lg:text-base text-sm font-medium pb-12 max-w-sm text-center">Ingresa tus credenciales para poder acceder a la aplicación</p>
                            <Form className="flex gap-8 items-center w-full" onSubmit={onSubmit}>
                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p>Correo electrónico</p>
                                                <TextAsterisk16Filled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current", input: "group-data-[invalid=true]:!text-current font-medium",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-background-100 text-current" }}
                                    className="w-full max-w-xs"
                                    color="primary"
                                    name="email"
                                    labelPlacement="outside"
                                    type="email"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={100}
                                    placeholder="Ingresa tu correo electrónico"
                                    endContent={<> <Checkmark12Filled className='size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:hidden' />  <div className="hidden group-data-[invalid=true]:block "><Dismiss12Filled className='size-4 text-danger' /></div> </>}
                                    validate={(value) => {
                                        if (value.length === 0){
                                            return "El campo es obligatorio."
                                        }
                                        
                                        if (value.length > 0 && !value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)){
                                            return "Ingresa una dirección de correo electrónico valida."
                                        }
                                    }}
                                />

                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p>Contraseña</p>
                                                <TextAsterisk16Filled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <Link className="text-secondary font-medium text-sm" to="/">¿Olvidaste tu contraseña?</Link>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current", input: "group-data-[invalid=true]:!text-current font-medium",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-background-100 text-current" }}
                                    className="w-full max-w-xs"
                                    color="primary"
                                    name="password"
                                    labelPlacement="outside"
                                    type={isVisible ? "text" : "password"}
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    placeholder="Ingresa tu contraseña"
                                    endContent={
                                        <button
                                            aria-label="toggle password visibility"
                                            className="focus:outline-none"
                                            type="button"
                                            onClick={toggleVisibility}
                                        >
                                            {isVisible ? (
                                                <EyeSlashIcon className="size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger" />
                                            ) : (                                        
                                                <EyeIcon className="size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger" />
                                            )}
                                        </button>
                                    }
                                    validate={(value) => {
                                        if (value.length === 0){
                                            return "El campo es obligatorio."
                                        }
                                    }}
                                />

                                <PrimaryButton
                                    isLoading={isLoading}
                                    isSubmit={true} 
                                    label="Iniciar sesión"
                                />
                            </Form>

                    </div>
                </div>
                <div className="bg-primary items-center justify-center px-16 col-span-2 lg:col-span-1 hidden md:block">

                </div>
            </div>
        </>
    );
}