# Simplapp V2 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

Simplapp V2 is a powerful, all-in-one business management platform designed to streamline operations for modern enterprises. From electronic invoicing to inventory control and CRM, Simplapp provides a unified, intuitive interface to keep your business under control.

> **"Configure every process, invoice in seconds."**

## ✨ Key Features

- **🚀 Electronic Invoicing V1.0**: Generate invoices, quotes, and remittances compliant with local regulations in seconds.
- **📊 Comprehensive Dashboard**: Visualize your business health in real-time with precise metrics and interactive charts.
- **👥 CRM (Customer Relationship Management)**: Maintain detailed records of clients and suppliers to enhance commercial relationships.
- **📦 Inventory Control**: Track stock levels, manage products, and streamline your supply chain.
- **📅 Sales Management**: organize your sales pipeline with Kanban views and detailed tracking.
- **🔔 Expiration Tracking**: Never miss a deadline with automated alerts for product expirations and invoice due dates.
- **🎨 Modern UI/UX**: Built with a premium design system featuring dark mode, glassmorphism, and smooth animations.

## 🛠️ Tech Stack

This project is built as a monorepo using modern web technologies:

### **Core**
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Monorepo Tooling:** [Turborepo](https://turbo.build/) / pnpm workspaces

### **Frontend**
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [PostCSS](https://postcss.org/)
- **Components:** [Radix UI](https://www.radix-ui.com/), `@simplapp/ui` (Internal Design System)
- **Animations:** [Framer Motion](https://www.framer.com/motion/), `tw-animate-css`
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Tables:** [TanStack Table](https://tanstack.com/table/v8)

### **Backend & Database**
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Auth:** Custom implementation with `jsonwebtoken`, `jose`, `bcryptjs`

## 📂 Project Structure

The repository is structured as a monorepo:

```bash
.
├── apps/
│   └── web/              # Main Next.js application
├── packages/
│   ├── ui/               # Shared UI component library
│   ├── domain/           # Core domain logic and entities
│   ├── interfaces/       # Shared TypeScript interfaces
│   └── config/           # Shared configuration files
└── README.md
```

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (Latest version recommended)
- PostgreSQL database

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Santy401/SimplappV2.git
    cd SimplappV2
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in `apps/web` based on the example (if available) or configure your database connection string:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/simplapp_db"
    # Add other necessary secrets (JWT_SECRET, etc.)
    ```

4.  **Database Setup:**
    Initialize the database using Prisma:
    ```bash
    pnpm --filter web db:seed # or the appropriate command to migrate/seed
    # Commonly:
    cd apps/web && npx prisma migrate dev
    ```

5.  **Run the Development Server:**
    ```bash
    pnpm dev
    ```

    OPEN [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Built with ❤️ by the **Simplapp Team**.
