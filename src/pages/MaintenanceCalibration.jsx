import { Tab, Tabs } from "@heroui/react"

export const MaintenanceCalibration = () => {

    return (
        <>  
            <div className="w-full flex justify-between">
                <p className="text-lg font-bold">Mantenimientos</p>
                <Tabs variant="underlined" classNames={{ tabList: "p-0 gap-4", tab: "p-0 text-sm font-medium"}}>
                    <Tab key="scheduled_maintenances" title="Programados" />
                    <Tab key="maintenances" title="No programados" />
                </Tabs>
            </div>
        </>
    )
}