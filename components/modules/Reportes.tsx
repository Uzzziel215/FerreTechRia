"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { obtenerReporteDiario, obtenerVentasPorFecha } from "../../services/ventaService"
import type { Usuario, Venta, Producto, Cliente } from "../../lib/types"
import { FileText } from "lucide-react"
import LoadingSpinner from "../ui/LoadingSpinner"

interface ReportesProps {
  usuario: Usuario
  ventas: Venta[]
  productos: Producto[]
  clientes: Cliente[]
}

export default function Reportes({ usuario, ventas, productos, clientes }: ReportesProps) {
  const { toast } = useToast()
  const [reporteDiario, setReporteDiario] = useState<any>(null)
  const [ventasPorFecha, setVentasPorFecha] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  useEffect(() => {
    const cargarReporte = async () => {
      try {
        setLoading(true)
        const reporte = await obtenerReporteDiario()
        setReporteDiario(reporte)
      } catch (error) {
        toast({
          title: "Error al cargar reporte",
          description: "No se pudo cargar el reporte diario.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    cargarReporte()
  }, [toast])

  const cargarVentasPorFecha = async () => {
    if (!fechaInicio || !fechaFin) {
      toast({
        title: "Fechas requeridas",
        description: "Por favor selecciona fechas de inicio y fin.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const ventasData = await obtenerVentasPorFecha(`${fechaInicio}T00:00:00`, `${fechaFin}T23:59:59`)
      setVentasPorFecha(ventasData)
    } catch (error) {
      // El error se maneja en el interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reportes y Estadísticas</CardTitle>
          <CardDescription>Análisis de ventas y rendimiento del negocio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-medium text-gray-600">Ventas Hoy</h3>
                <p className="text-2xl font-bold text-green-600">
                  {reporteDiario?.cantidadVentas || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-medium text-gray-600">Total Hoy</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${(reporteDiario?.totalVentas || 0).toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-medium text-gray-600">Productos</h3>
                <p className="text-2xl font-bold text-blue-600">{productos.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-medium text-gray-600">Clientes</h3>
                <p className="text-2xl font-bold text-purple-600">{clientes.length}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reporte de Ventas por Fecha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <Input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <Button onClick={cargarVentasPorFecha} disabled={loading}>
              {loading ? <LoadingSpinner size="small" text="" /> : "Buscar"}
            </Button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner text="Cargando ventas..." />
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {ventasPorFecha.map((venta) => (
                <div key={venta.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Venta #{venta.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(venta.fecha).toLocaleString()} - {venta.usuario.nombre}
                    </p>
                    {venta.cliente && (
                      <p className="text-sm text-gray-600">Cliente: {venta.cliente.nombre}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${venta.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{venta.detalles.length} productos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
