import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsSummary } from "../components/analytics/AnalyticsSummary"
import { InventoryChartWrapper, OrdersChartWrapper } from "../components/wrappers/ChartWrapper"

export default function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Dashboard Overview</h1>
      
      {/* Analytics Summary */}
      <div className="mb-6">
        <AnalyticsSummary />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryChartWrapper />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersChartWrapper />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="hover:bg-slate-800/50 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Upload Data</h3>
                <p className="text-sm text-muted-foreground">
                  Import inventory or orders data
                </p>
              </div>
              <span className="text-2xl">📤</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:bg-slate-800/50 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Generate Report</h3>
                <p className="text-sm text-muted-foreground">
                  Create custom analytics report
                </p>
              </div>
              <span className="text-2xl">📊</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:bg-slate-800/50 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Manage Orders</h3>
                <p className="text-sm text-muted-foreground">
                  View and update orders
                </p>
              </div>
              <span className="text-2xl">📝</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
