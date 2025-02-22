# Portfolio

## Description
This project is a scalable single-page application (SPA) personal blog system. It integrates secure user login using AWS Cognito and manages authentication flows with JWT tokens to ensure robust authorization.

## Key Features
- **User Authentication**: Secure login and authentication using AWS Cognito and JWT tokens.
- **API Gateway**: Spring Boot-based API Gateway with a rate limiter to enhance system reliability and performance.
- **Caching and Session Storage**: Utilizes Redis for high-speed caching and distributed session storage, ensuring data scalability and efficient handling of large content.
- **Media Management**: Integrated AWS S3 for reliable, scalable storage of media assets (images, videos) and a WYSIWYG editor for a seamless content creation and media management experience.

## Language Used
- **Java** (49.7%)
- **TypeScript** (44.3%)
- **JavaScript** (4.6%)
- **Other** (1.4%)

## Getting Started

### Prerequisites
- Node.js
- pnpm or yarn
- Java
- Redis
- AWS account for Cognito and S3

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/rkw014/Portfolio.git
   cd Portfolio
   ```

2. **Backend Setup:**
   - Prepare your S3 bucket to store uploaded files
   - Create an IAM user with `s3:PutObject` access to your desired bucket
   - Navigate to the `gateway`, `blog-service`, and `user-service` directories and follow the setup instructions provided to run the Spring Boot backends.
   Prepare and provide environment variables as follow:
   - For `gateway`:
      ```dotenv
      JWK_SET_URI=
      PORT=8180
      ```
   - For `blog-service`  
      ```dotenv
      AWS_ACCESS_KEY_ID=
      AWS_SECRET_ACCESS_KEY=
      AWS_REGION=
      AWS_S3_BUCKET_NAME=
      ```
      Alternatively, provide AWS credentials using your preferred method
   - Change database/Redis addresses and credentials in `application.properties` according to your environment
   - Run following commands in each directory to start each services
      ```bash
      set -a && source .env.local && set +a && ./mvnw spring-boot:run
      ```  

3. **Frontend Setup:**  
   Set up your AWS Cognito application and Mailgun instance. Then, fill in the following environment variables in the `.env.development.local` and `.env.production.local` files with your corresponding credentials:
   ```dotenv
   NEXT_PUBLIC_COGNITO_AUTHORITY=
   NEXT_PUBLIC_COGNITO_CLIENT_ID=
   NEXT_PUBLIC_COGNITO_LOGOUT_URI=
   NEXT_PUBLIC_COGNITO_REDIR_URI=
   NEXT_PUBLIC_COGNITO_SCOPE=email openid phone
   NEXT_PUBLIC_COGNITO_DOMAIN=

   NEXT_PUBLIC_GATEWAY_URI=

   MAILGUN_API_KEY=
   MAILGUN_DOMAIN=
   CONTACT_TO_EMAIL=
   CONTACT_FROM_NAME=
   CONTACT_FROM_EMAIL=
   REDIS_URL=redis://docker1.lan:6201/1
   ```
   - Navigate to the `frontend` directory.
   - Install the dependencies:
     ```bash
     pnpm install
     ```
   - Run the development server:
     ```bash
     pnpm dev
     ```
   - Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

   Use the `pnpx build` command to build a distributable package, then use `docker build -t <image tag>` to build the Docker image for deployment.

### Project Structure
- `frontend/`: Contains the frontend code built with Next.js.
- `gateway/`: Contains the Spring Boot API Gateway code.
- `blog-service/`: Contains the Spring Boot blog-service code.
- `user-service/`: Contains the Spring Boot user-service code.

## Learn More
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Spring Boot Documentation](https://spring.io/projects/spring-boot) - Learn about Spring Boot features and API.

## License
This project is licensed under the MIT License.

## Contributions
Contributions are welcome! Please feel free to submit a pull request.

## Contact
For any inquiries, please contact wangrk197@gmail.com.
