import { NextRequest, NextResponse } from 'next/server';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  features: string[];
}

const products: Product[] = [
  {
    id: '1',
    name: 'Next.js Starter Kit',
    description: 'Complete starter kit for building modern web applications with Next.js 14',
    price: 99.99,
    category: 'Development Tools',
    stock: 150,
    features: [
      'App Router with React Server Components',
      'TypeScript configuration',
      'Tailwind CSS integration',
      'ESLint and Prettier setup',
      'Testing framework included',
    ],
  },
  {
    id: '2',
    name: 'YC-OpenNext Deployment Guide',
    description: 'Comprehensive guide for deploying Next.js applications to Yandex Cloud',
    price: 49.99,
    category: 'Documentation',
    stock: 500,
    features: [
      'Step-by-step deployment instructions',
      'Best practices for production',
      'Troubleshooting guide',
      'Performance optimization tips',
      'Example configurations',
    ],
  },
  {
    id: '3',
    name: 'React Server Components Course',
    description: 'Learn how to build high-performance applications with React Server Components',
    price: 149.99,
    category: 'Education',
    stock: 75,
    features: [
      'Video tutorials (10+ hours)',
      'Hands-on projects',
      'Source code examples',
      'Community access',
      'Lifetime updates',
    ],
  },
];

// GET /api/products - Get all products or a single product by ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // If ID is provided, return a single product
    if (id) {
      const product = products.find((p) => p.id === id);

      if (!product) {
        return NextResponse.json({ error: 'Product not found', id }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: product,
        timestamp: new Date().toISOString(),
      });
    }

    // Filter products based on query parameters
    let filteredProducts = [...products];

    if (category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filteredProducts = filteredProducts.filter((p) => p.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filteredProducts = filteredProducts.filter((p) => p.price <= max);
      }
    }

    return NextResponse.json({
      success: true,
      data: filteredProducts,
      count: filteredProducts.length,
      total: products.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// POST /api/products - Create a new product (simulated)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'category'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          missingFields,
        },
        { status: 400 },
      );
    }

    // Create new product
    const newProduct: Product = {
      id: String(products.length + 1),
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      category: body.category,
      stock: body.stock || 0,
      features: body.features || [],
    };

    // In a real application, you would save this to a database
    // products.push(newProduct)

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        data: newProduct,
        timestamp: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request body',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 },
    );
  }
}

// PUT /api/products - Update a product (simulated)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 },
      );
    }

    const product = products.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          id,
        },
        { status: 404 },
      );
    }

    // In a real application, you would update the database
    const updatedProduct = { ...product, ...updates };

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in PUT /api/products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request body',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 },
    );
  }
}

// DELETE /api/products - Delete a product (simulated)
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 },
      );
    }

    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          id,
        },
        { status: 404 },
      );
    }

    // In a real application, you would delete from the database
    // const deletedProduct = products.splice(productIndex, 1)[0]

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in DELETE /api/products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
