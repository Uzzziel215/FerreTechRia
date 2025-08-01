"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Printer, Plus, Minus, Search, Scan } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  crearVenta,
  obtenerTodasLasVentas,
  generarTicket,
} from "../../services/ventaService"
import { obtenerTodosLosProductos, buscarProductos } from "../../services/productoService"
import { obtenerTodosLosClientes } from "../../services/clienteService"
import type { Producto, Cliente, DetalleVenta, Venta, Usuario } from "../../lib/types"
import LoadingSpinner from "../ui/LoadingSpinner"

interface VentasProps {
  usuario: Usuario
}

export default function Ventas({ usuario }: VentasProps) {
  const { toast } = useToast()

  const [productos, setProductos] = useState<Producto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [ventas, setVentas] = useState<Venta[]>([])
  const [carritoVenta, setCarritoVenta] = useState<DetalleVenta[]>([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [busquedaProducto, setBusquedaProducto] = useState("")
  const [activeTab, setActiveTab] = useState("nueva")
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [ticketContent, setTicketContent] = useState("")
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null)

  const cargarDatos = async () => {
    try {
      const [productosData, clientesData, ventasData] = await Promise.all([
        obtenerTodosLosProductos(),
        obtenerTodosLosClientes(),
        obtenerTodasLasVentas(),
      ])
      setProductos(productosData)
      setClientes(clientesData)
      setVentas(ventasData)
    } catch (error) {
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [toast])

  const agregarAlCarrito = (producto: Producto, cantidad = 1) => {
    if (producto.stock < cantidad) {
      toast({
        title: "❌ Stock Insuficiente",
        description: `Solo hay ${producto.stock} unidades disponibles`,
        variant: "destructive",
      })
      return
    }

    const detalleExistente = carritoVenta.find((d) => d.productoId === producto.id)

    if (detalleExistente) {
      const nuevaCantidad = detalleExistente.cantidad + cantidad
      if (nuevaCantidad > producto.stock) {
        toast({
          title: "❌ Stock Insuficiente",
          description: `Solo hay ${producto.stock} unidades disponibles`,
          variant: "destructive",
        })
        return
      }

      setCarritoVenta((carrito) =>
        carrito.map((d) =>
          d.productoId === producto.id
            ? { ...d, cantidad: nuevaCantidad, subtotal: nuevaCantidad * d.precioUnitario }
            : d,
        ),
      )
    } else {
      const nuevoDetalle: DetalleVenta = {
        productoId: producto.id,
        producto,
        cantidad,
        precioUnitario: producto.precio,
        subtotal: cantidad * producto.precio,
      }
      setCarritoVenta((carrito) => [...carrito, nuevoDetalle])
    }
  }

  const removerDelCarrito = (productoId: number) => {
    setCarritoVenta((carrito) => carrito.filter((d) => d.productoId !== productoId))
  }

  const calcularTotal = () => {
    const subtotal = carritoVenta.reduce((sum: number, detalle: DetalleVenta) => sum + detalle.subtotal, 0)
    const descuento = clienteSeleccionado ? (subtotal * (clienteSeleccionado.descuento || 0)) / 100 : 0
    return subtotal - descuento
  }

  const procesarVenta = async () => {
    if (carritoVenta.length === 0) {
      toast({
        title: "❌ Carrito Vacío",
        description: "Agregue productos antes de procesar la venta",
        variant: "destructive",
      })
      return
    }

    const ventaData = {
      clienteId: clienteSeleccionado?.id,
      usuarioId: usuario.id,
      detalles: carritoVenta.map((d) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
      })),
    }

    try {
      const nuevaVenta = await crearVenta(ventaData)
      handleGenerarTicket(nuevaVenta)
      setCarritoVenta([])
      setClienteSeleccionado(null)
      cargarDatos()
    } catch (error) {
      // El error ya se maneja en el interceptor de axios
    }
  }

  const handleGenerarTicket = async (venta: Venta) => {
    try {
      const ticketData = await generarTicket(venta.id)
      const modifiedTicket = ticketData.ticket.replace(/FERRETERÍA EL MARTILLO/g, "FerreTechRia")
      setTicketContent(modifiedTicket)
      setSelectedVenta(venta)
      setShowTicketModal(true)
    } catch (error) {
      toast({
        title: "Error al generar ticket",
        variant: "destructive",
      })
    }
  }

  const handleBusqueda = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const termino = e.target.value
    setBusquedaProducto(termino)
    if (termino.trim() === "") {
      const productosData = await obtenerTodosLosProductos()
      setProductos(productosData)
    } else {
      const resultados = await buscarProductos(termino)
      setProductos(resultados)
    }
  }

  return (
    <>
      <div className="flex space-x-4 mb-4">
        <Button onClick={() => setActiveTab("nueva")} variant={activeTab === "nueva" ? "default" : "outline"}>
          Nueva Venta
        </Button>
        <Button onClick={() => setActiveTab("historial")} variant={activeTab === "historial" ? "default" : "outline"}>
          Historial
        </Button>
      </div>

      {activeTab === "nueva" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Catálogo de Productos</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre, código de barras o categoría..."
                      value={busquedaProducto}
                      onChange={handleBusqueda}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Scan className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {productos.map((producto) => (
                    <Card key={producto.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm">{producto.nombre}</h3>
                          <Badge variant={producto.stock <= producto.stockMinimo ? "destructive" : "secondary"}>
                            Stock: {producto.stock}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{producto.descripcion}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-green-600">${producto.precio.toFixed(2)}</span>
                          <Button
                            size="sm"
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={producto.stock === 0}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Agregar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Carrito de Venta</CardTitle>
                {clienteSeleccionado && (
                  <div className="text-sm text-gray-600">
                    Cliente: {clienteSeleccionado.nombre}
                    {clienteSeleccionado.descuento > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {clienteSeleccionado.descuento}% desc.
                      </Badge>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {carritoVenta.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Carrito vacío</p>
                ) : (
                  <>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {carritoVenta.map((detalle) => (
                        <div
                          key={detalle.productoId}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{detalle.producto.nombre}</p>
                            <p className="text-xs text-gray-600">
                              {detalle.cantidad} x ${detalle.precioUnitario.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">${detalle.subtotal.toFixed(2)}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removerDelCarrito(detalle.productoId)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-xl font-bold text-green-600">${calcularTotal().toFixed(2)}</span>
                      </div>

                      <div className="space-y-2">
                        <select
                          className="w-full p-2 border rounded"
                          value={clienteSeleccionado?.id || ""}
                          onChange={(e) => {
                            const cliente = clientes.find((c) => c.id === Number.parseInt(e.target.value))
                            setClienteSeleccionado(cliente || null)
                          }}
                        >
                          <option value="">Cliente General</option>
                          {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                              {cliente.nombre} {cliente.descuento > 0 && `(${cliente.descuento}% desc.)`}
                            </option>
                          ))}
                        </select>

                        <Button onClick={procesarVenta} className="w-full" size="lg">
                          <Printer className="h-4 w-4 mr-2" />
                          Procesar Venta
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "historial" && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {ventas.map((venta) => (
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
                    <Button size="sm" variant="outline" onClick={() => handleGenerarTicket(venta)}>
                      🧾 Ticket
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Ticket - Venta #{selectedVenta?.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto">{ticketContent}</pre>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowTicketModal(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => navigator.clipboard.writeText(ticketContent)}>
                  Copiar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
