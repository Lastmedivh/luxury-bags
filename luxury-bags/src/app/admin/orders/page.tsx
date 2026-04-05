'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShoppingBag, Package, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Order {
  id: string
  userId: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
  orderItems: {
    id: string
    productId: string
    quantity: number
    price: number
    product: {
      name: string
      images: string
    }
  }[]
}

const statusConfig = {
  PENDING: { label: '待处理', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PROCESSING: { label: '处理中', color: 'bg-blue-100 text-blue-800', icon: Package },
  SHIPPED: { label: '已发货', color: 'bg-purple-100 text-purple-800', icon: Package },
  DELIVERED: { label: '已送达', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: '已取消', color: 'bg-red-100 text-red-800', icon: XCircle },
}

const paymentStatusConfig = {
  PENDING: { label: '待支付', color: 'bg-yellow-100 text-yellow-800' },
  PAID: { label: '已支付', color: 'bg-green-100 text-green-800' },
  FAILED: { label: '支付失败', color: 'bg-red-100 text-red-800' },
  REFUNDED: { label: '已退款', color: 'bg-gray-100 text-gray-800' },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('获取订单列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        fetchOrders()
      } else {
        alert(data.error || '更新状态失败')
      }
    } catch (error) {
      console.error('更新状态失败:', error)
      alert('更新状态失败，请重试')
    }
  }

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">订单管理</h1>
          <p className="text-gray-500 mt-1">管理所有订单信息</p>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="筛选状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部订单</SelectItem>
              <SelectItem value="PENDING">待处理</SelectItem>
              <SelectItem value="PROCESSING">处理中</SelectItem>
              <SelectItem value="SHIPPED">已发货</SelectItem>
              <SelectItem value="DELIVERED">已送达</SelectItem>
              <SelectItem value="CANCELLED">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 订单列表 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>商品</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>支付状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
                const paymentInfo = paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig]
                const StatusIcon = statusInfo?.icon

                return (
                  <TableRow 
                    key={order.id} 
                    className={`cursor-pointer ${selectedOrder?.id === order.id ? 'bg-gray-50' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell className="font-medium">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        <span>{order.orderItems.length} 件商品</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ¥{order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusInfo?.color}>
                        {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                        {statusInfo?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={paymentInfo?.color}>
                        {paymentInfo?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">待处理</SelectItem>
                          <SelectItem value="PROCESSING">处理中</SelectItem>
                          <SelectItem value="SHIPPED">已发货</SelectItem>
                          <SelectItem value="DELIVERED">已送达</SelectItem>
                          <SelectItem value="CANCELLED">已取消</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">暂无订单</p>
            </div>
          )}
        </div>

        {/* 订单详情 */}
        {selectedOrder && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">订单详情</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">订单号</div>
                <div className="font-medium">{selectedOrder.id}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">下单时间</div>
                <div className="font-medium">
                  {new Date(selectedOrder.createdAt).toLocaleString('zh-CN')}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">订单金额</div>
                <div className="text-2xl font-bold text-red-600">
                  ¥{selectedOrder.totalAmount.toFixed(2)}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2">商品列表</div>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
                        <img
                          src={item.product.images.split(',')[0] || '/placeholder.jpg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium line-clamp-1">
                          {item.product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          数量: {item.quantity} × ¥{item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
