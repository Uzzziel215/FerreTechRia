"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Devolucion, Usuario } from "../../lib/types"

interface DevolucionesProps {
  usuario: Usuario
}

export default function Devoluciones({ usuario }: DevolucionesProps) {
  const { toast } = useToast()
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([])

  useEffect(() => {
    // Aquí se llamaría al servicio para obtener las devoluciones
    // const devolucionesData = await obtenerTodasLasDevoluciones();
    // setDevoluciones(devolucionesData);
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Devoluciones</CardTitle>
        <CardDescription>Control de productos devueltos y ajustes de inventario</CardDescription>
      </CardHeader>
      <CardContent>
        {devoluciones.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay devoluciones registradas</p>
        ) : (
          <div className="space-y-4">
            {devoluciones.map((devolucion) => (
              <Card key={devolucion.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">Devolución #{devolucion.id}</h3>
                    <Badge variant="outline">${devolucion.total.toFixed(2)}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Venta original: #{devolucion.ventaId}</p>
                    <p>Fecha: {new Date(devolucion.fecha).toLocaleString()}</p>
                    <p>Motivo: {devolucion.motivo}</p>
                    <p>Productos: {devolucion.productos.length}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
