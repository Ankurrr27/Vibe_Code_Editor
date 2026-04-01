# Vibe Code Editor

A full-stack browser-based coding workspace built with Next.js, Monaco, WebContainers, and NextAuth.

This project combines a modern code playground, template-based project creation, an online compiler, authentication, and a personal dashboard into one developer-focused app.

Live app: [vibe-code-editor-omega.vercel.app](https://vibe-code-editor-omega.vercel.app)

## Features

- Browser-based coding experience with Monaco Editor
- Template-driven playgrounds for multiple stacks
- Online compiler with real-time output and terminal panel
- Google and GitHub authentication with NextAuth
- Personal dashboard to manage playgrounds
- Starred and recent playground tracking
- User insights page for admin/owner access
- Responsive interface with resizable IDE-style panels

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- NextAuth v5
- Prisma
- MongoDB
- Monaco Editor
- WebContainer API
- Judge0-compatible compiler API
- Radix UI + shadcn-style component setup

## Main Sections

### 1. Landing Page

Public-facing home page introducing the product and routing users into the app.

### 2. Auth

Users can sign in using:

- Google
- GitHub

### 3. Playground

The playground is the main coding area of the app. It supports project creation from templates and provides an editor-first workflow.

Current template support in the data model includes:

- React
- Next.js
- Express
- Vue
- Hono
- Angular

### 4. Online Compiler

The compiler section provides:

- language selection
- editor pane
- output pane
- terminal pane
- stdin support

It is designed like a lightweight browser IDE and uses a Judge0-compatible execution API.

### 5. Dashboard

The dashboard lets users:

- access their playgrounds
- see starred projects
- jump into recent work
- open compiler tools

### 6. User Insights

Admin-level access can view user-wise app usage through the users page.

## Project Structure

```bash
app/
  (auth)/
  (root)/
  api/
  compiler/
  dashboard/
  playground/

modules/
  auth/
  compiler/
  dashboard/
  home/
  playground/
  webcontainers/

prisma/
```



## Why I Built This

I built Vibe Code Editor to create a smoother browser-based coding experience that feels more like a real developer workspace than a simple code sandbox. The goal was to combine project templates, live coding, compilation, auth, and dashboard management into one polished product.



## Author

Ankur Singh

- LinkedIn: [linkedin.com/in/ankurrr27](https://www.linkedin.com/in/ankurrr27/)

