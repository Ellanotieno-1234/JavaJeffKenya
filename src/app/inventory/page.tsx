import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "../../components/inventory/FileUploader"
import { InventoryTable } from "../../components/inventory/InventoryTable"
import { InventoryChartWrapper } from "../../components/wrappers/ChartWrapper"

export default function InventoryPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Inventory Data</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryChartWrapper />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryTable />
        </CardContent>
      </Card>
    </div>
  )
}
