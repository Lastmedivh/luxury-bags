'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'

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

export default function ProductDetailPage() {
  const params = useParams()
  const { addItem, isLoading: isAddingToCart } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const data = await response.json()
      setProduct(data.product)
      setRelatedProducts(data.relatedProducts || [])
      setSelectedImage(0)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    try {
      await addItem(product.id, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } catch (error) {
      console.error('添加到购物车失败:', error)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return
    
    try {
      await addItem(product.id, quantity)
      // 跳转到结算页面
      window.location.href = '/checkout'
    } catch (error) {
      console.error('添加到购物车失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">商品不存在</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 面包屑导航 */}
      <div className="text-sm text-gray-600 mb-6">
        <span>首页</span>
        <span className="mx-2">/</span>
        <span>商品</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：图片画廊 */}
        <div>
          {/* 主图 */}
          <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.images[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 缩略图 */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? 'border-black'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 右侧：商品信息 */}
        <div>
          {/* 商品名称 */}
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* 价格 */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-bold text-red-600">
              ¥{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-400 line-through">
                ¥{product.originalPrice}
              </span>
            )}
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* 库存和销量 */}
          <div className="flex items-center gap-4 mb-6">
            <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
              {product.stock > 0 ? `库存 ${product.stock}` : '缺货'}
            </Badge>
            <Badge variant="secondary">
              已售 {product.soldCount}
            </Badge>
            {product.isFeatured && (
              <Badge className="bg-red-500">推荐</Badge>
            )}
          </div>

          {/* 描述 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">商品描述</h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* 购买区域 */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium">数量:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={!product || quantity >= product.stock}
                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    已添加
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {isAddingToCart ? '添加中...' : '加入购物车'}
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0 || isAddingToCart}
                className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? '处理中...' : '立即购买'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 推荐商品 */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">推荐商品</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="min-w-[280px] flex-shrink-0 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={relatedProduct.images[0] || '/placeholder.jpg'}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                    />
                    {relatedProduct.isFeatured && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        推荐
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-red-600">
                        ¥{relatedProduct.price}
                      </span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ¥{relatedProduct.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      加入购物车
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
