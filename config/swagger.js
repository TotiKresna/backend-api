// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '📝 Matematika Detik API Documentation',
      version: '1.0.0',
      description: `
Complete API documentation for Second Mathematic Application.

## 📚 Features
- Authentication & Authorization
- User Management
- Student Management
- Test Results Management

## 👨‍💻 Developer
Created by [Toti Kresna](https://github.com/TotiKresna)

## 🔑 Authentication
This API uses JWT Bearer token for authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer your-token-here
\`\`\`
      `,
    },
    servers: [
      {
        url: process.env.BACKEND_URL || 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Username for authentication',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin', 'superadmin'],
              description: 'User role',
            },
          },
        },
        Student: {
          type: 'object',
          required: ['nama', 'kelas'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011'
            },
            nama: {
              type: 'string',
              description: 'Nama siswa',
              example: 'John Doe'
            },
            kelas: {
              type: 'string',
              description: 'Kelas siswa',
              example: 'Informatika'
            }
          }
        },
        TestResult: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011'
            },
            student_id: {
              type: 'string',
              description: 'Reference to Student ID',
              example: '507f1f77bcf86cd799439011'
            },
            opm_tambah: {
              type: 'number',
              description: 'Nilai operasi tambah',
              example: 85
            },
            opm_kurang: {
              type: 'number',
              description: 'Nilai operasi kurang',
              example: 80
            },
            opm_kali: {
              type: 'number',
              description: 'Nilai operasi kali',
              example: 75
            },
            opm_bagi: {
              type: 'number',
              description: 'Nilai operasi bagi',
              example: 70
            },
            opm_total: {
              type: 'number',
              description: 'Total nilai operasi',
              example: 310
            }
          }
        }
      }
    },
    paths: {
      // Auth Routes
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'User registered successfully'
            },
            500: {
              description: 'Server error'
            }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: {
                      type: 'string'
                    },
                    password: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful'
            },
            401: {
              description: 'Invalid credentials'
            }
          }
        }
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout user',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Logout successful'
            }
          }
        }
      },
      '/auth/superadmin/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of users retrieved successfully'
            },
            500: {
                description: 'Error fetching users'
            }
          }
        }
      },
      '/auth/superadmin/updateUser': {
        put: {
          tags: ['Users'],
          summary: 'Update users',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User updated successfully'
            },
            500: {
                description: 'Error updating user'
            }
          }
        }
      },
      '/auth/superadmin/deleteUser': {
        delete: {
          tags: ['Users'],
          summary: 'Delete users',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User deleted successfully'
            },
            500: {
                description: 'Error deleting user'
            }
          }
        }
      },
      // Student Routes
      '/api/students': {
        get: {
          tags: ['Students'],
          summary: 'Get all students',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of students',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Student'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Students'],
          summary: 'Create a new student',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Student'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Student created successfully'
            }
          }
        }
      },
      '/api/students/{id}': {
        get: {
          tags: ['Students'],
          summary: 'Get student by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            200: {
              description: 'Student found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Student'
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ['Students'],
          summary: 'Update student',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Student'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Student updated successfully'
            }
          }
        },
        delete: {
          tags: ['Students'],
          summary: 'Delete student',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            200: {
              description: 'Student deleted successfully'
            }
          }
        }
      },
      '/api/students/delete-multiple': {
        post: {
          tags: ['Students'],
          summary: 'Delete multiple students',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ids: {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Students deleted successfully'
            }
          }
        }
      },
      // Test Result Routes
      '/api/test-results': {
        get: {
          tags: ['Test Results'],
          summary: 'Get all test results',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of test results',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/TestResult'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Test Results'],
          summary: 'Create a new test result',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TestResult'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Test result created successfully'
            }
          }
        }
      },
      '/api/test-results/{id}': {
        get: {
          tags: ['Test Results'],
          summary: 'Get test result by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            200: {
              description: 'Test result found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TestResult'
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ['Test Results'],
          summary: 'Update test result',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TestResult'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Test result updated successfully'
            }
          }
        },
        delete: {
          tags: ['Test Results'],
          summary: 'Delete test result',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            200: {
              description: 'Test result deleted successfully'
            }
          }
        }
      },
      '/api/test-results/delete-multiple': {
        post: {
          tags: ['Test Results'],
          summary: 'Delete multiple test results',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ids: {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Test results deleted successfully'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;