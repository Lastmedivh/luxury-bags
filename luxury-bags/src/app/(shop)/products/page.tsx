'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ShoppingCart } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  }
  tags: string[]
  stock: number
  isFeatured: boolean
  soldCount: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sort, setSort] = useState('default')

  useEffect(() => {
    fetchProducts()
  }, [category, priceRange, sort])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.append('category', category)
      params.append('minPrice', priceRange[0].toString())
      params.append('maxPrice', priceRange[1].toString())
      params.append('sort', sort)

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">全部商品</h1>

      {/* 筛选栏 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 分类筛选 */}
          <div>
            <label className="block text-sm font-medium mb-2">分类</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="classic">经典款</SelectItem>
                <SelectItem value="fashion">时尚款</SelectItem>
                <SelectItem value="limited">限量款</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 价格区间 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              价格区间: ¥{priceRange[0]} - ¥{priceRange[1]}
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={5000}
              step={100}
              className="mt-2"
            />
          </div>

          {/* 排序 */}
          <div>
            <label className="block text-sm font-medium mb-2">排序</label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="选择排序" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">推荐</SelectItem>
                <SelectItem value="price-asc">价格从低到高</SelectItem>
                <SelectItem value="price-desc">价格从高到低</SelectItem>
                <SelectItem value="sales">销量优先</SelectItem>
                <SelectItem value="newest">最新上架</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">暂无商品</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* 商品图片 */}
                <div className="relative aspect-square">
                  <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.isFeatured && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      推荐
                    </Badge>
                  )}
                </div>

                {/* 商品信息 */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* 价格 */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-red-600">
                      ¥{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ¥{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* 销量标签 */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      已售 {product.soldCount}
                    </Badge>
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                      {product.stock > 0 ? `库存 ${product.stock}` : '缺货'}
                    </Badge>
                  </div>

                  {/* 加入购物车按钮 */}
                  <button className="w-full mt-4 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    加入购物车
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
