const swaggerJSDoc = require("swagger-jsdoc");
const { PORT, API_VERSION } = process.env;


const swagger_sdk_definition = {
  openapi: "3.0.0",
  info: {
    title: "Loyalty SDK API Documentation",
    version: "1.0.0",
    description: "API documentation for clients integrating with the Loyalty SDK",
    contact: {
      name: "Support Team",
      email: "info@continuityoman.com",
      url: "https://continuityoman.com/",
    },
  },
  servers: [
    {
      url: `https://api-loyalty.xyvin.com/api/${API_VERSION}/client`,
      description: "SDK Staging Server",
    },
    {
      url: `http://localhost:${PORT}/api/${API_VERSION}/client`,
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "sdk-api-key",
        description: "API Key required for SDK authentication",
      },
      customer_id: {
        type: "apiKey",
        in: "header",
        name: "customer_id",
        description: "Customer ID required for SDK authentication",
      },
    },
  },
  security: [{ ApiKeyAuth: ['7f4d082c436b88976239f94e3f984aa965db89e0650377d8caf715222204df5b'] }, { customer_id: ['CUST123456'] }],
};

const sdk_options = {
  swaggerDefinition: swagger_sdk_definition,
  apis: [
    "./src/swagger/sdk_paths/*.yaml",  // Include all YAML files
    "./src/swagger/sdk_paths/*.js"     // Include all JS files
  ],
};

const sdk_swagger_spec = swaggerJSDoc(sdk_options);
const sdk_swagger_options = {
  swaggerOptions: {
    docExpansion: "none",
    filter: true,
    tagsSorter: "alpha",
    operationsSorter: "alpha",
  },
};

module.exports = { sdk_swagger_spec, sdk_swagger_options };
