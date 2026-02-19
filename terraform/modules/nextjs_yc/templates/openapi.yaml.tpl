openapi: 3.0.0
info:
  title: ${api_name}
  version: 1.0.0

paths:
  # Static assets from Object Storage
  /_next/static/{proxy+}:
    get:
      summary: Serve static Next.js assets
      parameters:
        - name: proxy
          in: path
          required: true
          schema:
            type: string
      x-yc-apigateway-integration:
        type: object_storage
        bucket: ${assets_bucket}
        object: assets/${build_id}/_next/static/{proxy}
        service_account_id: ${service_account_id}

  /public/{proxy+}:
    get:
      summary: Serve public assets
      parameters:
        - name: proxy
          in: path
          required: true
          schema:
            type: string
      x-yc-apigateway-integration:
        type: object_storage
        bucket: ${assets_bucket}
        object: assets/${build_id}/public/{proxy}
        service_account_id: ${service_account_id}

%{ if has_image ~}
  # Image optimization endpoint
  /_next/image:
    get:
      summary: Next.js image optimization
      parameters:
        - name: url
          in: query
          required: true
          schema:
            type: string
        - name: w
          in: query
          required: false
          schema:
            type: integer
        - name: q
          in: query
          required: false
          schema:
            type: integer
      x-yc-apigateway-integration:
        type: cloud_functions
        function_id: ${image_function_id}
        function_version_id: ${image_version_id}
        service_account_id: ${service_account_id}
        payload_format_version: "1.0"
%{ endif ~}

%{ if has_server ~}
  # API routes
  /api/{proxy+}:
    any:
      summary: API route handler
      parameters:
        - name: proxy
          in: path
          required: false
          schema:
            type: string
      x-yc-apigateway-integration:
        type: cloud_functions
        function_id: ${server_function_id}
        function_version_id: ${server_version_id}
        service_account_id: ${service_account_id}
        payload_format_version: "1.0"

  # Catch-all for SSR pages
  /{proxy+}:
    any:
      summary: Server-side rendered pages
      parameters:
        - name: proxy
          in: path
          required: false
          schema:
            type: string
      x-yc-apigateway-integration:
        type: cloud_functions
        function_id: ${server_function_id}
        function_version_id: ${server_version_id}
        service_account_id: ${service_account_id}
        payload_format_version: "1.0"

  # Root path
  /:
    any:
      summary: Root path handler
      x-yc-apigateway-integration:
        type: cloud_functions
        function_id: ${server_function_id}
        function_version_id: ${server_version_id}
        service_account_id: ${service_account_id}
        payload_format_version: "1.0"
%{ endif ~}