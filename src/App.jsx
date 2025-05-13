import { useState } from 'react'
import { 
  Button, 
  Input, 
  Drawer,
  DrawerContent,
  useDisclosure,
  Divider,
  Tooltip,
} from "@heroui/react";
import { ClockIcon, DocumentTextIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon, } from '@heroicons/react/24/solid'
import { PeopleFilled, TextBulletListSquareFilled, TextBulletListFilled } from '@fluentui/react-icons';
import { useIsIconOnly } from './global/hooks/useIsIconOnly';
import { ThemeSwitcher } from './global/components/ThemeSwitcher';
import { PrimaryButton } from './global/components/PrimaryButton';
import { SecondaryButton } from './global/components/SecondaryButton';
import { TextButton } from './global/components/TextButton';
import { CloseButton } from './global/components/CloseButton';


function App() {
  const isIconOnly = useIsIconOnly() // Usamos el hook aquí
  const [isVisible, setIsVisible] = useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      <div className="flex w-screen h-screen">
        <div className='hidden flex-col items-center sm:flex lg:w-52 w-[70px] rounded-r-lg outline outline-1 outline-background-800 bg-background-950 pt-10 pb-6 px-4 justify-between transition-all ease-out duration-500 '>
          <div className='w-full'>

            <div className='w-full flex flex-col items-center'>
              <p className="hidden text-base font-bold lg:flex truncate">Lab Métricas</p>
              <Tooltip
                offset={15}
                showArrow
                radius='sm'
                color="foreground"
                className="text-sm font-medium"
                placement="right"
                closeDelay={0}
                content={ 
                  <div className="h-6 flex justify-center items-center mx-1">
                    <p>Menú</p> 
                  </div>
                }
                delay={0}
                >
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none hidden sm:flex lg:hidden"
                  type="button"
                  onClick={onOpen}
                  >
                  {<TextBulletListSquareFilled className='size-6' />}
                </button>
              </Tooltip>
            </div>

            <Divider className="my-4 bg-background-800"/>

            <div className='space-y-1 flex flex-col lg:items-start items-center'>
              <TextButton
                isSubmit={false}
                isIconOnly={isIconOnly}
                isActive={false}
                label="Historial"
                tooltipLabel="Historial"
                tooltipPlacement="right"
                onPress={() => alert("Presionaste el botón de texto")}
                startContent={<ClockIcon className='size-5' />}
              />

              <TextButton
                isSubmit={false}
                isIconOnly={isIconOnly}
                isActive={false}
                label="Documentos"
                tooltipLabel="Documentos"
                tooltipPlacement="right"
                onPress={() => alert("Presionaste el botón de texto")}
                startContent={<DocumentTextIcon className='size-5' />}
              />

              <TextButton
                isSubmit={false}
                isIconOnly={isIconOnly}
                isActive={true}
                label="Usuarios"
                tooltipLabel="Usuarios"
                tooltipPlacement="right"
                onPress={() => alert("Presionaste el botón de texto")}
                startContent={<PeopleFilled className='size-5' />}
              />
            </div>
          </div>

          <div className='transition-all ease-in-out duration-500'>
            <ThemeSwitcher isIconOnly={isIconOnly}/>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto transition-all ease-in-out duration-500'>
          <div className='mb-6 sm:mt-10 sm:mx-12 mt-6 mx-8'>
            <div className='flex items-center gap-2 sm:pb-10 pb-6'>
              <Button
                className='sm:hidden'
                isIconOnly
                size="md"
                radius="sm"
                variant="light"
                onPress={onOpen}
                >
                <TextBulletListFilled className='size-5' />
              </Button>
              <p className='lg:text-2xl text-xl font-bold transition-all duration-500'>Tus usuarios</p>
            </div>

            <div className='flex flex-col items-start gap-8'>
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
                startContent={<DocumentTextIcon className='size-5' />}
              />
              <SecondaryButton
                isSubmit={false}
                isIconOnly={false}
                label="Botón secundario"
                tooltipLabel="Botón secundario"
                tooltipPlacement="right"
                onPress={() => alert("Presionaste el botón secundario")}
                startContent={<DocumentTextIcon className='size-5' />}
              />

              <PrimaryButton
                isSubmit={false}
                isIconOnly={true}
                label="Botón primario"
                tooltipLabel="Botón primario"
                tooltipPlacement="right"
                onPress={() => alert("Presionaste el botón primario")}
                startContent={<DocumentTextIcon className='size-5' />}
              />
              <PrimaryButton
                isSubmit={false}
                isIconOnly={false}
                label="Botón primario"
                tooltipLabel="Botón primario"
                tooltipPlacement="right"
                onPress={() => alert("Presionaste el botón primario")}
                startContent={<DocumentTextIcon className='size-5' />}
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
            </div>
          </div>
        </div>
      </div>


      <Drawer 
        isOpen={isOpen} 
        radius='sm'
        size='sm'
        onOpenChange={onOpenChange} 
        placement='left'
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
              x: -200,
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: "easeIn"
              }
            }
          }
        }}>
        <DrawerContent className='w-52 flex-col items-center justify-between outline outline-1 outline-background-800 bg-background-950 pt-10 pb-6 px-4'>
          {(onClose) => (
            <>
              <div className='w-full flex flex-col items-start'>
                <div className='w-full flex flex-col items-center'>
                  <h1 className="text-base font-bold">Lab Métricas</h1>
                </div>

                <Divider className="my-4 bg-background-800"/>

                <div className='space-y-1'>
                  <TextButton
                    isSubmit={false}
                    isIconOnly={false}
                    isActive={false}
                    label="Historial"
                    tooltipLabel="Historial"
                    tooltipPlacement="right"
                    onPress={() => alert("Presionaste el botón de texto")}
                    startContent={<ClockIcon className='size-5' />}
                  />

                  <TextButton
                    isSubmit={false}
                    isIconOnly={false}
                    isActive={false}
                    label="Documentos"
                    tooltipLabel="Documentos"
                    tooltipPlacement="right"
                    onPress={() => alert("Presionaste el botón de texto")}
                    startContent={<DocumentTextIcon className='size-5' />}
                  />

                  <TextButton
                    isSubmit={false}
                    isIconOnly={false}
                    isActive={true}
                    label="Usuarios"
                    tooltipLabel="Usuarios"
                    tooltipPlacement="right"
                    onPress={() => alert("Presionaste el botón de texto")}
                    startContent={<PeopleFilled className='size-5' />}
                  />
                </div>
              </div>

              <div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default App