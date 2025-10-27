# API Specification

## Database Models

```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  name            String?
  password        String
  role            String   @default("USER")
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  Token           Token[]
}

model Token {
  id          Int      @id @default(autoincrement())
  token       String
  type        String
  expires     DateTime
  blacklisted Boolean
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
}
```

## Authentication APIs

---

EP: POST /v1/auth/register
DESC: Register a new user account.
IN: body:{name:str!, email:str!, password:str!}
OUT: 201:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Email already taken", "422":"Validation error - invalid input data", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
EX_RES_201: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-27T10:30:45Z","updatedAt":"2025-10-27T10:30:45Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-27T11:30:45Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-03T10:30:45Z"}}}

---

EP: POST /v1/auth/login
DESC: Login with email and password.
IN: body:{email:str!, password:str!}
OUT: 200:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Invalid input data", "401":"Invalid email or password", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'
EX_RES_200: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-27T10:30:45Z","updatedAt":"2025-10-27T10:30:45Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-27T11:30:45Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-03T10:30:45Z"}}}

---

EP: POST /v1/auth/logout
DESC: Logout and invalidate refresh token.
IN: body:{refreshToken:str!}
OUT: 204:{}
ERR: {"400":"Invalid refresh token", "404":"Token not found", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/logout -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_204: {}

---

EP: POST /v1/auth/refresh-tokens
DESC: Refresh authentication tokens.
IN: body:{refreshToken:str!}
OUT: 200:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}
ERR: {"400":"Invalid refresh token", "401":"Token expired or invalid", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/refresh-tokens -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_200: {"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-27T11:30:45Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-03T10:30:45Z"}}

---

EP: POST /v1/auth/forgot-password
DESC: Request password reset email.
IN: body:{email:str!}
OUT: 204:{}
ERR: {"400":"Invalid email format", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/forgot-password -H "Content-Type: application/json" -d '{"email":"john@example.com"}'
EX_RES_204: {}

---

EP: POST /v1/auth/reset-password
DESC: Reset password using token from email.
IN: query:{token:str!}, body:{password:str!}
OUT: 204:{}
ERR: {"400":"Invalid password format", "401":"Invalid or expired token", "500":"Internal server error"}
EX_REQ: curl -X POST "/v1/auth/reset-password?token=abc123token" -H "Content-Type: application/json" -d '{"password":"newpassword123"}'
EX_RES_204: {}

---

EP: POST /v1/auth/send-verification-email
DESC: Send email verification link to authenticated user.
IN: headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized - invalid or missing token", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/send-verification-email -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: {}

---

EP: POST /v1/auth/verify-email
DESC: Verify email address using token from email.
IN: query:{token:str!}
OUT: 204:{}
ERR: {"400":"Invalid token format", "401":"Invalid or expired token", "500":"Internal server error"}
EX_REQ: curl -X POST "/v1/auth/verify-email?token=abc123token"
EX_RES_204: {}

## User Management APIs

---

EP: POST /v1/users
DESC: Create a new user (admin only).
IN: headers:{Authorization:str!}, body:{name:str!, email:str!, password:str!, role:str!}
OUT: 201:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already taken", "401":"Unauthorized", "403":"Forbidden - admin access required", "422":"Validation error", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123","role":"USER"}'
EX_RES_201: {"id":2,"email":"jane@example.com","name":"Jane Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-27T10:30:45Z","updatedAt":"2025-10-27T10:30:45Z"}

---

EP: GET /v1/users
DESC: Get list of users with pagination and filtering.
IN: headers:{Authorization:str!}, query:{name:str, role:str, sortBy:str, limit:int, page:int}
OUT: 200:{results:arr[{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "403":"Forbidden - admin access required", "422":"Invalid query parameters", "500":"Internal server error"}
EX_REQ: curl -X GET "/v1/users?page=1&limit=10&role=USER" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"results":[{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-27T10:30:45Z","updatedAt":"2025-10-27T10:30:45Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

EP: GET /v1/users/{userId}
DESC: Get user details by ID.
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"401":"Unauthorized", "403":"Forbidden - can only access own profile or admin required", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X GET /v1/users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-27T10:30:45Z","updatedAt":"2025-10-27T10:30:45Z"}

---

EP: PATCH /v1/users/{userId}
DESC: Update user information.
IN: headers:{Authorization:str!}, params:{userId:int!}, body:{name:str, email:str, password:str}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already taken", "401":"Unauthorized", "403":"Forbidden - can only update own profile or admin required", "404":"User not found", "422":"Validation error", "500":"Internal server error"}
EX_REQ: curl -X PATCH /v1/users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"John Smith"}'
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Smith","role":"USER","isEmailVerified":true,"createdAt":"2025-10-27T10:30:45Z","updatedAt":"2025-10-27T10:30:45Z"}

---

EP: DELETE /v1/users/{userId}
DESC: Delete a user account.
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{}
ERR: {"401":"Unauthorized", "403":"Forbidden - can only delete own profile or admin required", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /v1/users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {}

## Summary Generation APIs

---

EP: POST /api/summarize
DESC: Generate summary of provided text.
IN: body:{text:str!, options:{length:str}}
OUT: 200:{summary:str, wordCount:int, processingTime:float}
ERR: {"400":"Invalid input - text is required", "422":"Text too long or invalid length option", "500":"Internal server error"}
EX_REQ: curl -X POST /api/summarize -H "Content-Type: application/json" -d '{"text":"Climate change is one of the most pressing issues of our time...","options":{"length":"medium"}}'
EX_RES_200: {"summary":"This is a moderately detailed summary that captures the essential points of climate change impacts and solutions.","wordCount":65,"processingTime":1.8}

---

EP: GET /api/health
DESC: Check API health status.
IN: {}
OUT: 200:{status:str, timestamp:str}
ERR: {"500":"Internal server error"}
EX_REQ: curl -X GET /api/health
EX_RES_200: {"status":"healthy","timestamp":"2025-10-27T10:30:45Z"}