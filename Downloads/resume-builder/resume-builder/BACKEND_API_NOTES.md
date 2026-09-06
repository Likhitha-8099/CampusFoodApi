# AI Resume Builder Backend API Notes

## Base URL

```http
http://localhost:8080
```

---

## Resume APIs

### 1. Create Resume

```http
POST /api/resumes
```

Full URL:

```http
http://localhost:8080/api/resumes
```

Request Body:

```json
{
  "fullName": "Likith Naidu",
  "email": "likith@gmail.com",
  "phone": "9876543210",
  "linkedin": "https://linkedin.com/in/likith",
  "github": "https://github.com/likith",
  "summary": "Java backend developer skilled in Spring Boot and MySQL.",
  "skills": "Java, Spring Boot, JPA, MySQL, React",
  "education": "B.Tech Computer Science",
  "experience": "Built REST APIs using Spring Boot and MySQL.",
  "projects": "AI Resume Builder, Blood Bridge"
}
```

Expected Status:

```txt
201 CREATED
```

---

### 2. Get All Resumes

```http
GET /api/resumes
```

Full URL:

```http
http://localhost:8080/api/resumes
```

Expected Status:

```txt
200 OK
```

Expected Response:

```json
[
  {
    "id": 1,
    "fullName": "Likitha",
    "email": "likitha@gmail.com",
    "phone": "9876543210",
    "linkedin": "https://linkedin.com/in/likitha",
    "github": "https://github.com/likitha",
    "summary": "Java backend developer skilled in Spring Boot and MySQL.",
    "skills": "Java, Spring Boot, JPA, MySQL, React",
    "education": "B.Tech Computer Science",
    "experience": "Built REST APIs using Spring Boot and MySQL.",
    "projects": "AI Resume Builder, Blood Bridge"
  }
]
```

---

### 3. Get Resume By ID

```http
GET /api/resumes/{id}
```

Example:

```http
http://localhost:8080/api/resumes/1
```

Expected Status:

```txt
200 OK
```

If resume not found:

```json
{
  "message": "Resume not found with id: 100",
  "status": 404
}
```

---

### 4. Update Resume

```http
PUT /api/resumes/{id}
```

Example:

```http
http://localhost:8080/api/resumes/1
```

Request Body:

```json
{
  "fullName": "Likith Naidu Updated",
  "email": "likith.updated@gmail.com",
  "phone": "9876543210",
  "linkedin": "https://linkedin.com/in/likith-updated",
  "github": "https://github.com/likith",
  "summary": "Updated Java backend developer summary.",
  "skills": "Java, Spring Boot, JPA, MySQL, React",
  "education": "B.Tech Computer Science",
  "experience": "Updated backend experience.",
  "projects": "AI Resume Builder, Blood Bridge"
}
```

Expected Status:

```txt
200 OK
```

---

### 5. Delete Resume

```http
DELETE /api/resumes/{id}
```

Example:

```http
http://localhost:8080/api/resumes/1
```

Expected Response:

```txt
Resume deleted successfully with id: 1
```

Expected Status:

```txt
200 OK
```

---

### 6. Generate and Save AI Summary for Existing Resume

```http
PUT /api/resumes/{id}/generate-summary
```

Example:

```http
http://localhost:8080/api/resumes/1/generate-summary
```

Request Body:

```txt
No body required
```

Expected:

```txt
If AI succeeds, generated summary will be saved into the resume summary field.
If AI fails, old summary remains unchanged.
```

Expected Status:

```txt
200 OK
```

---

## AI APIs

### 1. Generate AI Summary Only

```http
POST /api/ai/generate-summary
```

Full URL:

```http
http://localhost:8080/api/ai/generate-summary
```

Request Body:

```json
{
  "fullName": "Likith Naidu",
  "skills": "Java, Spring Boot, MySQL, React",
  "experience": "Built REST APIs using Spring Boot and connected them with MySQL database.",
  "projects": "AI Resume Builder, Blood Bridge"
}
```

Expected Response:

```json
{
  "summary": "AI-generated professional summary here"
}
```

Expected Status:

```txt
200 OK
```

---

## Swagger URL

```http
http://localhost:8080/swagger-ui.html
```

or

```http
http://localhost:8080/swagger-ui/index.html
```

---

## Validation Rules

Resume create/update request uses validation.

Required fields:

```txt
fullName
email
phone
summary
skills
```

Rules:

```txt
fullName should not be blank
email should be valid
phone should be 10 digits
summary should not be blank
skills should not be blank
```

Example validation error:

```json
{
  "fullName": "Full name is required",
  "email": "Email should be valid",
  "phone": "Phone number must be 10 digits"
}
```

---

## Backend Features Completed

```txt
Resume CRUD APIs
MySQL database integration
Spring Data JPA
DTO layer
Validation
Global Exception Handling
ResponseEntity
Gemini AI API integration
AI summary generation
Generate and save summary into resume
Swagger API documentation
```

---

## Environment Variables

Gemini API key should be stored safely.

```properties
ai.api.key=${GEMINI_API_KEY}
ai.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
ai.api.model=gemini-2.5-flash
```

Do not push real API keys to GitHub.