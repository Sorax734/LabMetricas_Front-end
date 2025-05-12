import { useState } from 'react'
import { Input, Button, } from "@heroui/react";
import { DocumentTextIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon, H1Icon, H2Icon} from '@heroicons/react/24/solid'
import { ThemeSwitcher } from './global/components/ThemeSwitcher';
import { PrimaryButton } from './global/components/PrimaryButton';
import { SecondaryButton } from './global/components/SecondaryButton';
import { TextButton } from './global/components/TextButton';

function App() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      <div className='flex flex-col items-start my-20 mx-40 gap-8'>
        <Input 
          className="max-w-xs"
          label="Email" 
          labelPlacement="outside"
          placeholder="Ingresa tu correo electrónico" 
          type="email" 
          color='primary'
          variant="bordered" 
          size="md"
          endContent={<EnvelopeIcon className='size-5 text-primary group-data-[invalid=true]:text-danger group-data-[invalid=true]:animate-shake'/>}
          classNames={{ label: "font-medium" }}
        />

        <Input 
          className="max-w-xs"
          label="Contraseña" 
          labelPlacement="outside" 
          placeholder="Ingresa tu contraseña"
          type={isVisible ? "text" : "password"}
          color='primary'
          variant="bordered" 
          size="md"
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashIcon className="size-5 text-primary group-data-[invalid=true]:text-danger group-data-[invalid=true]:animate-shake" />
              ) : (
                <EyeIcon className="size-5 text-primary group-data-[invalid=true]:text-danger group-data-[invalid=true]:animate-shake" />
              )}
            </button>
          }
          classNames={{ label: "font-medium" }}
        />

        <SecondaryButton
          isSubmit={false}
          isIconOnly={true}
          label="Botón secundario"
          tooltipLabel="Botón secundario"
          tooltipPlacement="right"
          onPress={() => alert("Presionaste el botón secundario")}
          startContent={<H2Icon className='size-5' />}
        />
        <SecondaryButton
          isSubmit={false}
          isIconOnly={false}
          label="Botón secundario"
          tooltipLabel="Botón secundario"
          tooltipPlacement="right"
          onPress={() => alert("Presionaste el botón secundario")}
          startContent={<H2Icon className='size-5' />}
        />

        <PrimaryButton
          isSubmit={false}
          isIconOnly={true}
          label="Botón primario"
          tooltipLabel="Botón primario"
          tooltipPlacement="right"
          onPress={() => alert("Presionaste el botón primario")}
          startContent={<H1Icon className='size-5' />}
        />
        <PrimaryButton
          isSubmit={false}
          isIconOnly={false}
          label="Botón primario"
          tooltipLabel="Botón primario"
          tooltipPlacement="right"
          onPress={() => alert("Presionaste el botón primario")}
          startContent={<H1Icon className='size-5' />}
        />

        <TextButton
          isSubmit={false} 
          isIconOnly={true} 
          isActive={false}
          label="Botón de texto"
          tooltipLabel="Botón de texto"
          tooltipPlacement="right"
          onPress={() => alert("Presionaste el botón de texto")}
          startContent={<DocumentTextIcon className='size-5' />}
        />

        <TextButton
          isSubmit={false} 
          isIconOnly={false} 
          isActive={false}
          label="Botón de texto"
          tooltipLabel="Botón de texto"
          tooltipPlacement="right"
          onPress={() => alert("Presionaste el botón de texto")}
          startContent={<DocumentTextIcon className='size-5' />}
        />

        <TextButton
          isSubmit={false} 
          isIconOnly={true} 
          isActive={true}
          label="Botón de texto"
          tooltipLabel="Botón de texto"
          tooltipPlacement="right"
          onPress={() => alert("Presionaste el botón de texto")}
          startContent={<DocumentTextIcon className='size-5' />}
        />

        <TextButton
          isSubmit={false} 
          isIconOnly={false} 
          isActive={true}
          label="Botón de texto"
          tooltipLabel="Botón de texto"
          tooltipPlacement="right"
          onPress={() => alert("Presionaste el botón de texto")}
          startContent={<DocumentTextIcon className='size-5' />}
        />

        <ThemeSwitcher/>
      </div>
    </>
  )
}

export default App
