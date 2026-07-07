"use client";
import Link from "next/link";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: number;
    name_bn: string;
    name_en: string;
    slug: string;
    regular_price: string;
    sale_price: string;
    discount_percent: number;
    main_image: string | null;
    stock_quantity: number;
    status: string;
    is_featured: boolean;
    is_new_arrival: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlistStore();
  const [isAdding, setIsAdding] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock_quantity <= 0) return;
    setIsAdding(true);
    addItem({
      id: product.id,
      name_bn: product.name_bn,
      name_en: product.name_en,
      price: parseFloat(product.sale_price),
      image: product.main_image || "https://placehold.co/500x500/e2e8f0/333?text=No+Image",
      quantity: 1,
      stock: product.stock_quantity,
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeWishlist(product.id);
    } else {
      addWishlist(product.id);
    }
  };

  return (
    <Link href={`/product/${product.slug}`} className="product-card bg-white rounded-xl overflow-hidden border border-gray-100 group block">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={product.main_image || "https://placehold.co/500x500/e2e8f0/333?text=No+Image"}
          alt={product.name_bn}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.discount_percent > 0 && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount_percent}%
            </span>
          )}
          {product.is_new_arrival && (
            <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            wishlisted ? "bg-red-500 text-white" : "bg-white/80 text-gray-500 hover:bg-white hover:text-red-500"
          }`}
        >
          <i className={`fas fa-heart text-sm ${wishlisted ? "" : ""}`}></i>
        </button>

        {/* Out of Stock Overlay */}
        {product.stock_quantity <= 0 || product.status === "out_of_stock" ? (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold">স্টক আউট</span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name_bn}
        </h3>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <i key={s} className="fas fa-star text-xs text-yellow-400"></i>
          ))}
          <span className="text-xs text-gray-400 ml-1">(0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="sale-price text-base">৳{parseInt(product.sale_price).toLocaleString("en-BD")}</span>
          {product.discount_percent > 0 && (
            <span className="regular-price">৳{parseInt(product.regular_price).toLocaleString("en-BD")}</span>
          )}
        </div>

        {/* Add to Cart */}
        {product.stock_quantity > 0 && product.status !== "out_of_stock" ? (
          <button
            onClick={handleAddToCart}
            className="w-full py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: isAdding ? "#059669" : "#dc2626" }}
          >
            {isAdding ? (
              <i className="fas fa-check mr-1"></i>
            ) : (
              <i className="fas fa-shopping-cart mr-1"></i>
            )}
            {isAdding ? "Added!" : "কার্টে যোগ করুন"}
          </button>
        ) : (
          <button
            disabled
            className="w-full py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
          >
            স্টক আউট
          </button>
        )}
      </div>
    </Link>
  );
}
