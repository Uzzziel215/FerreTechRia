"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ShoppingCart,
  Package,
  Users,
  RotateCcw,
  FileText,
  Settings,
  AlertTriangle,
  LogOut,
  Cog,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { login, logout, verificarSesion } from "../services/authService"
import { obtenerProductosConStockBajo } from "../services/productoService"
import type { Usuario, Producto, Cliente, Venta, Devolucion } from "../lib/types"

import Ventas from "../components/modules/Ventas"
import Productos from "../components/modules/Productos"
import Clientes from "../components/modules/Clientes"
import Devoluciones from "../components/modules/Devoluciones"
import Reportes from "../components/modules/Reportes"
import Configuracion from "../components/modules/Configuracion"
import { obtenerTodasLasVentas } from "@/services/ventaService"
import { obtenerTodosLosProductos } from "@/services/productoService"
import { obtenerTodosLosClientes } from "@/services/clienteService"

export default function SistemaFerreteria() {
  const { toast } = useToast()

  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null)
  const [loginForm, setLoginForm] = useState({ usuario: "", contraseña: "" })
  const [alertasStock, setAlertasStock] = useState<Producto[]>([])
  
  const [ventas, setVentas] = useState<Venta[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([])

  useEffect(() => {
    const usuarioGuardado = verificarSesion()
    if (usuarioGuardado) {
      setUsuarioActual(usuarioGuardado)
    }
  }, [])

  useEffect(() => {
    if (usuarioActual) {
      verificarAlertasStock()
      cargarDatosGenerales()
    }
  }, [usuarioActual])

  const cargarDatosGenerales = async () => {
    try {
      const [ventasData, productosData, clientesData] = await Promise.all([
        obtenerTodasLasVentas(),
        obtenerTodosLosProductos(),
        obtenerTodosLosClientes(),
      ]);
      setVentas(ventasData);
      setProductos(productosData);
      setClientes(clientesData);
    } catch (error) {
      toast({
        title: "Error al cargar datos generales",
        variant: "destructive",
      });
    }
  };

  const verificarAlertasStock = async () => {
    try {
      const productosConStockBajo = await obtenerProductosConStockBajo()
      setAlertasStock(productosConStockBajo)

      if (productosConStockBajo.length > 0) {
        toast({
          title: "⚠️ Alerta de Stock Bajo",
          description: `${productosConStockBajo.length} productos requieren reabastecimiento`,
          variant: "destructive",
        })
      }
    } catch (error) {
      // El error se maneja en el interceptor
    }
  }

  const handleLogin = async () => {
    try {
      const data = await login(loginForm.usuario, loginForm.contraseña)
      setUsuarioActual(data.usuario)
      localStorage.setItem("usuario", JSON.stringify(data.usuario))
      toast({
        title: "✅ Acceso Autorizado",
        description: `Bienvenido ${data.usuario.nombre} - ${data.usuario.rol}`,
      })
    } catch (error) {
      // El error ya se maneja en el interceptor de axios y authService
    }
  }

  const handleLogout = () => {
    logout()
    setUsuarioActual(null)
    setLoginForm({ usuario: "", contraseña: "" })
  }

  if (!usuarioActual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center">
              <Cog className="h-8 w-8 mr-2 text-blue-600" />
              <CardTitle className="text-2xl font-bold text-gray-800">FerreTechRia</CardTitle>
            </div>
            <CardDescription>Sistema de Gestión de Ventas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usuario">Usuario</Label>
              <Input
                id="usuario"
                placeholder="Ingrese su nombre de usuario"
                value={loginForm.usuario}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, usuario: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contraseña">Contraseña</Label>
              <Input
                id="contraseña"
                type="password"
                placeholder="Ingrese su contraseña"
                value={loginForm.contraseña}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, contraseña: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Cog className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">FerreTechRia</h1>
              <Badge variant="outline">{usuarioActual.rol}</Badge>
            </div>

            <div className="flex items-center space-x-4">
              {alertasStock.length > 0 && (
                <Alert className="w-auto">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{alertasStock.length} productos con stock bajo</AlertDescription>
                </Alert>
              )}

              <span className="text-sm text-gray-600">{usuarioActual.nombre}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="ventas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="ventas" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Ventas</span>
            </TabsTrigger>
            <TabsTrigger value="productos" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Productos</span>
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="devoluciones" className="flex items-center space-x-2">
              <RotateCcw className="h-4 w-4" />
              <span>Devoluciones</span>
            </TabsTrigger>
            <TabsTrigger value="reportes" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Reportes</span>
            </TabsTrigger>
            <TabsTrigger value="configuracion" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ventas">
            <Ventas usuario={usuarioActual} />
          </TabsContent>
          <TabsContent value="productos">
            <Productos usuario={usuarioActual} />
          </TabsContent>
          <TabsContent value="clientes">
            <Clientes usuario={usuarioActual} ventas={ventas} />
          </TabsContent>
          <TabsContent value="devoluciones">
            <Devoluciones usuario={usuarioActual} />
          </TabsContent>
          <TabsContent value="reportes">
            <Reportes usuario={usuarioActual} ventas={ventas} productos={productos} clientes={clientes} />
          </TabsContent>
          <TabsContent value="configuracion">
            <Configuracion 
              usuario={usuarioActual} 
              productos={productos} 
              clientes={clientes} 
              ventas={ventas} 
              devoluciones={devoluciones} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
