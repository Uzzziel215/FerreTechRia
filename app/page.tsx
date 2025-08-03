"use client"

import { useContext } from "react"
import AuthContext from "../context/AuthContext"
import Seed from "../components/modules/Seed"
import {
  ShoppingCart,
  Package,
  Users,
  RotateCcw,
  FileText,
  Settings,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Ventas from "../components/modules/Ventas"
import Productos from "../components/modules/Productos"
import Clientes from "../components/modules/Clientes"
import Devoluciones from "../components/modules/Devoluciones"
import Reportes from "../components/modules/Reportes"
import Configuracion from "../components/modules/Configuracion"

export default function SistemaFerreteria() {
  const { user } = useContext(AuthContext)

  if (!user) {
    return <div>Por favor, inicie sesión para continuar.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Seed />
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
            <Ventas usuario={user} />
          </TabsContent>
          <TabsContent value="productos">
            <Productos usuario={user} />
          </TabsContent>
          <TabsContent value="clientes">
            <Clientes usuario={user} ventas={[]} />
          </TabsContent>
          <TabsContent value="devoluciones">
            <Devoluciones usuario={user} />
          </TabsContent>
          <TabsContent value="reportes">
            <Reportes usuario={user} ventas={[]} productos={[]} clientes={[]} />
          </TabsContent>
          <TabsContent value="configuracion">
            <Configuracion
              usuario={user}
              productos={[]}
              clientes={[]}
              ventas={[]}
              devoluciones={[]}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
