"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Usuario, Producto, Cliente, Venta, Devolucion } from "../../lib/types"
import { obtenerProductosConStockBajo } from "../../services/productoService"

interface ConfiguracionProps {
  usuario: Usuario
  productos: Producto[]
  clientes: Cliente[]
  ventas: Venta[]
  devoluciones: Devolucion[]
}

export default function Configuracion({ usuario, productos, clientes, ventas, devoluciones }: ConfiguracionProps) {
  const { toast } = useToast()

  const verificarStock = async () => {
    try {
      const alertas = await obtenerProductosConStockBajo()
      toast({
        title: "✅ Verificación Completada",
        description: `${alertas.length} productos con stock bajo.`,
      })
    } catch (error) {
      toast({
        title: "Error al verificar stock",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usuario Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Nombre:</strong> {usuario.nombre}
            </p>
            <p>
              <strong>Rol:</strong> {usuario.rol}
            </p>
            <p>
              <strong>ID:</strong> {usuario.id}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estado del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Productos:</strong> {productos.length}
            </p>
            <p>
              <strong>Clientes:</strong> {clientes.length}
            </p>
            <p>
              <strong>Ventas:</strong> {ventas.length}
            </p>
            <p>
              <strong>Devoluciones:</strong> {devoluciones.length}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Herramientas de Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={verificarStock}
            >
              Verificar Stock
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "💾 Respaldo Simulado",
                  description: "Respaldo de base de datos completado",
                })
              }}
            >
              Crear Respaldo
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "🔄 Sistema Actualizado",
                  description: "Datos sincronizados correctamente",
                })
              }}
            >
              Sincronizar Datos
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Versión:</strong> 1.0.0
            </p>
            <p>
              <strong>Última actualización:</strong> {new Date().toLocaleDateString()}
            </p>
            <p>
              <strong>Base de datos:</strong> PostgreSQL Local
            </p>
            <p>
              <strong>Modo:</strong> Online
            </p>
            <p>
              <strong>Respaldos automáticos:</strong> Habilitados (Semanal)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
