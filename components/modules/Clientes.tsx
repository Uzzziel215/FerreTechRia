"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  obtenerTodosLosClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  buscarClientes,
} from "../../services/clienteService"
import type { Cliente, Usuario, Venta } from "../../lib/types"
import LoadingSpinner from "../ui/LoadingSpinner"
import ConfirmDialog from "../ui/ConfirmDialog"
import { Label } from "@radix-ui/react-label"

interface ClientesProps {
  usuario: Usuario
  ventas: Venta[]
}

export default function Clientes({ usuario, ventas }: ClientesProps) {
  const { toast } = useToast()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: "",
  })

  const cargarClientes = async () => {
    try {
      setLoading(true)
      const clientesData = await obtenerTodosLosClientes()
      setClientes(clientesData)
    } catch (error) {
      toast({
        title: "Error al cargar clientes",
        description: "No se pudieron cargar los datos de clientes.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarClientes()
  }, [])

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      cargarClientes()
    } else {
      try {
        const resultados = await buscarClientes(term)
        setClientes(resultados)
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
      if (editingCliente) {
        await actualizarCliente(editingCliente.id, formData)
      } else {
        await crearCliente(formData)
      }

      setShowModal(false)
      setEditingCliente(null)
      resetForm()
      cargarClientes()
    } catch (error) {
      // El error se maneja en el interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData({
      nombre: cliente.nombre,
      email: cliente.email || "",
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
      fechaNacimiento: cliente.fechaNacimiento || "",
    })
    setShowModal(true)
  }

  const handleDeleteClick = (cliente: Cliente) => {
    setClienteToDelete(cliente)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!clienteToDelete) return

    try {
      await eliminarCliente(clienteToDelete.id)
      cargarClientes()
    } catch (error) {
      // El error se maneja en el interceptor
    } finally {
      setShowDeleteDialog(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      fechaNacimiento: "",
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
        <LoadingSpinner size="large" text="Cargando clientes..." />
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Clientes</CardTitle>
              <CardDescription>Administración de clientes y descuentos especiales</CardDescription>
            </div>
            <Button onClick={() => setShowModal(true)} disabled={submitting}>
              ➕ Nuevo Cliente
            </Button>
          </div>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Buscar clientes por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientes.map((cliente) => (
              <Card key={cliente.id}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{cliente.nombre}</h3>
                      {cliente.descuento > 0 && <Badge variant="secondary">{cliente.descuento}% desc.</Badge>}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📞 {cliente.telefono}</p>
                      <p>✉️ {cliente.email}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      Compras: {ventas.filter((v) => v.clienteId === cliente.id).length}
                    </div>
                    {usuario.rol === "administrador" && (
                      <div className="flex justify-end space-x-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(cliente)} disabled={submitting}>
                          ✏️ Editar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(cliente)} disabled={submitting}>
                          🗑️ Eliminar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {clientes.length === 0 && !loading && (
            <div className="text-center py-8">
              <p>No se encontraron clientes</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{editingCliente ? "Editar Cliente" : "Nuevo Cliente"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input name="nombre" value={formData.nombre} onChange={handleChange} required disabled={submitting} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" name="email" value={formData.email} onChange={handleChange} disabled={submitting} />
                    </div>
                    <div className="space-y-2">
                      <Label>Teléfono</Label>
                      <Input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} disabled={submitting} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Dirección</Label>
                    <textarea name="direccion" value={formData.direccion} onChange={handleChange} rows={3} className="w-full p-2 border rounded" disabled={submitting} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de Nacimiento</Label>
                    <Input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} disabled={submitting} />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingCliente(null); resetForm(); }} disabled={submitting}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? <LoadingSpinner size="small" text="" /> : (editingCliente ? "Actualizar" : "Crear")}
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
        title="Eliminar Cliente"
        message={`¿Estás seguro de eliminar el cliente "${clienteToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  )
}
