module.exports = {
  openapi: "3.0.0",
  info: {
    title: "API Fullstack Viba - UsuariosJoel",
    version: "1.0.0",
    description: "Documentación del CRUD para la tabla UsersJoel",
  },
  paths: {
    "/api/auth/login": {
  post: {
    summary: "Iniciar sesión",
    tags: ["Auth"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              CorreoElectronico: { type: "string" },
              password: { type: "string" }
            },
            required: ["CorreoElectronico", "password"]
          }
        }
      }
    },
    responses: {
      200: {
        description: "Inicio de sesión exitoso (JWT generado)",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  description: "Token JWT para autenticación"
                }
              },
              example: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              }
            }
          }
        }
      },
      401: { description: "Credenciales inválidas" },
      400: { description: "Faltan campos requeridos" },
      500: { description: "Error del servidor" }
    }
  }
    },

    "/api/usuarios": {
      get: {
        summary: "Obtener todos los usuarios",
        tags: ["Usuarios"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de usuarios",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      UsuarioID: { type: "integer" },
                      NombreUsuario: { type: "string" },
                      CorreoElectronico: { type: "string" },
                      FechaRegistro: { type: "string", format: "date-time" },
                      EsActivo: { type: "boolean" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Crear nuevo usuario",
        tags: ["Usuarios"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  NombreUsuario: { type: "string" },
                  CorreoElectronico: { type: "string" },
                  password: { type: "string" }
                },
                required: ["NombreUsuario", "CorreoElectronico", "password"]
              }
            }
          }
        },
        responses: {
          201: { description: "Usuario creado exitosamente" },
          400: { description: "Faltan campos obligatorios" }
        }
      }
    },
    "/api/usuarios/{id}": {
      get: {
        summary: "Obtener un usuario por ID",
        tags: ["Usuarios"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          200: { description: "Usuario encontrado" },
          404: { description: "Usuario no encontrado" }
        }
      },
      put: {
        summary: "Actualizar un usuario",
        tags: ["Usuarios"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  NombreUsuario: { type: "string" },
                  CorreoElectronico: { type: "string" },
                  password: { type: "string" },
                  EsActivo: { type: "boolean" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Usuario actualizado" },
          400: { description: "Nada que actualizar" }
        }
      },
      delete: {
        summary: "Eliminar usuario por ID",
        tags: ["Usuarios"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          200: { description: "Usuario eliminado" }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};
