"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  obtenerTodosLosProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosConStockBajo,
  buscarProductos,
  obtenerCategorias,
  obtenerProveedores,
} from "../../services/productoService"
import type { Producto, Usuario } from "../../lib/types"
import LoadingSpinner from "../ui/LoadingSpinner"
import ConfirmDialog from "../ui/ConfirmDialog"
import { Label } from "@radix-ui/react-label"

interface ProductosProps {
  usuario: Usuario
}

export default function Productos({ usuario }: ProductosProps) {
  const { toast } = useToast()
  const [productos, setProductos] = useState<Producto[]>([])
  const [alertasStock, setAlertasStock] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Producto | null>(null)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categorias, setCategorias] = useState<string[]>([])
  const [proveedores, setProveedores] = useState<string[]>([])
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    stockMinimo: "",
    codigoBarras: "",
    proveedor: "",
    categoria: "",
  })

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [productosData, alertasData, categoriasData, proveedoresData] = await Promise.all([
        obtenerTodosLosProductos(),
        obtenerProductosConStockBajo(),
        obtenerCategorias(),
        obtenerProveedores(),
      ])
      setProductos(productosData)
      setAlertasStock(alertasData)
      setCategorias(categoriasData)
      setProveedores(proveedoresData)
    } catch (error) {
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos de productos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      cargarDatos()
    } else {
      try {
        const resultados = await buscarProductos(term)
        setProductos(resultados)
      } catch (error) {
        toast({
          title: "Error en búsqueda",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const productoData = {
        ...formData,
        precio: Number.parseFloat(formData.precio),
        stock: Number.parseInt(formData.stock),
        stockMinimo: Number.parseInt(formData.stockMinimo),
      }

      if (editingProduct) {
        await actualizarProducto(editingProduct.id, productoData)
      } else {
        await crearProducto(productoData)
      }

      setShowModal(false)
      setEditingProduct(null)
      resetForm()
      cargarDatos()
    } catch (error) {
      // El error se maneja en el interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto)
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      stockMinimo: producto.stockMinimo.toString(),
      codigoBarras: producto.codigoBarras || "",
      proveedor: producto.proveedor,
      categoria: producto.categoria,
    })
    setShowModal(true)
  }

  const handleDeleteClick = (producto: Producto) => {
    setProductToDelete(producto)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    try {
      await eliminarProducto(productToDelete.id)
      cargarDatos()
    } catch (error) {
      // El error se maneja en el interceptor
    } finally {
      setShowDeleteDialog(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      stockMinimo: "",
      codigoBarras: "",
      proveedor: "",
      categoria: "",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner size="large" text="Cargando productos..." />
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Productos</CardTitle>
              <CardDescription>Control de inventario y catálogo de productos</CardDescription>
            </div>
            <Button onClick={() => setShowModal(true)} disabled={submitting}>
              ➕ Nuevo Producto
            </Button>
          </div>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Buscar productos por nombre o código de barras..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertasStock.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Productos con stock bajo:</strong>
                  <ul className="mt-2 space-y-1">
                    {alertasStock.map((producto) => (
                      <li key={producto.id} className="text-sm">
                        • {producto.nombre} - Stock: {producto.stock} (Mínimo: {producto.stockMinimo})
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productos.map((producto) => (
                <Card key={producto.id}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{producto.nombre}</h3>
                        <Badge variant={producto.stock <= producto.stockMinimo ? "destructive" : "secondary"}>
                          {producto.stock} unidades
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{producto.descripcion}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-green-600">${producto.precio.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">{producto.categoria}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>Proveedor: {producto.proveedor}</p>
                        {producto.codigoBarras && <p>Código: {producto.codigoBarras}</p>}
                      </div>
                      {usuario.rol === "administrador" && (
                        <div className="flex justify-end space-x-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(producto)} disabled={submitting}>
                            ✏️ Editar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(producto)} disabled={submitting}>
                            🗑️ Eliminar
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre *</Label>
                      <Input name="nombre" value={formData.nombre} onChange={handleChange} required disabled={submitting} />
                    </div>
                    <div className="space-y-2">
                      <Label>Código de Barras</Label>
                      <Input name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} disabled={submitting} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="w-full p-2 border rounded" disabled={submitting} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Precio *</Label>
                      <Input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} required disabled={submitting} />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock *</Label>
                      <Input type="number" name="stock" value={formData.stock} onChange={handleChange} required disabled={submitting} />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock Mínimo *</Label>
                      <Input type="number" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} required disabled={submitting} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Categoría *</Label>
                      <Input name="categoria" value={formData.categoria} onChange={handleChange} list="categorias" required disabled={submitting} />
                      <datalist id="categorias">
                        {categorias.map((cat) => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>
                    <div className="space-y-2">
                      <Label>Proveedor *</Label>
                      <Input name="proveedor" value={formData.proveedor} onChange={handleChange} list="proveedores" required disabled={submitting} />
                      <datalist id="proveedores">
                        {proveedores.map((prov) => (
                          <option key={prov} value={prov} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingProduct(null); resetForm(); }} disabled={submitting}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? <LoadingSpinner size="small" text="" /> : (editingProduct ? "Actualizar" : "Crear")}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Producto"
        message={`¿Estás seguro de eliminar el producto "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  )
}
