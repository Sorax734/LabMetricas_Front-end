import { CheckmarkCircleFilled, DismissCircleFilled, SubtractCircleFilled } from "@fluentui/react-icons";
import { ChangeStatusModal } from "../ChangeStatusModal"
import { PrimaryButton } from "../PrimaryButton";
import { useState } from "react";
import { addToast } from "@heroui/react";
import { changeStatus } from "../../service/equipment";

export const EquipmentsChangeStatusModal = ({isOpen, onOpenChange, data, onRefresh}) => {
    const [isLoading, setIsLoading] = useState(false)

    const onChangeStatus = async () => {
        try {
            setIsLoading(true)

            const response = await changeStatus(data.id)

            if (response.type === "SUCCESS"){
                addToast({
                    title: `Se ${data.status === "activo" ? "inhabilitó" : "habilitó"} al equipo: ${data.name}`,
                    description: `con código: ${data.code}`,
                    color: "primary",
                    icon: <CheckmarkCircleFilled className='size-5' />
                })
            } else {
                addToast({
                    title: `No se ${data.status === "activo" ? "inhabilitó" : "habilitó"} a ${data.name}`,
                    color: "danger",
                    icon: <DismissCircleFilled className='size-5' />
                })
            }
        } catch (error) {
            addToast({
                title: `No se ${data.status === "activo" ? "inhabilitó" : "habilitó"} a ${data.name}`,
                description: error.response.data.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
        } finally {
            setIsLoading(false)
            onOpenChange(false)
            onRefresh()
        }
    }

    if (data){
        return (
            <ChangeStatusModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={`¿Desea ${data.status === "activo" ? "inhabilitar" : "habilitar"} al equipo: ${data.name}?`}
                description={data.status === "activo" ? "Al inhabilitar el equipo, no estará disponible, pero podrá ser habilitado nuevamente en cualquier momento." : "Al habilitar el equipo, se restablecerá su disponibilidad con normalidad."}
            >
                <PrimaryButton
                    label={data.status === "activo" ? "Inhabilitar" : "Habilitar"}
                    startContent={data.status === "activo" ? <SubtractCircleFilled className="size-5"/> : <CheckmarkCircleFilled className="size-5"/>}
                    isLoading={isLoading}
                    onPress={onChangeStatus}
                />
            </ChangeStatusModal>
        )
    }
}