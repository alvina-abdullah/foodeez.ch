# 🍽️ Foodeez - Modern Food Exploring Platform

Foodeez is a cutting-edge food exploring platform built with Next.js 14, offering a seamless experience for exploring food online. The platform features a modern UI, real-time reviews, and an intuitive user interface.

## ✨ Features

- 🎨 Modern and Responsive UI
- 🔍 Advanced Search and Filtering
- 📱 Mobile-First Design
- 🔐 Secure Authentication
- 🚀 Fast and Optimized Performance

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Animations:** Framer Motion
- **Maps Integration:** Google Maps API
- **Database:** Prisma
- **Icons:** Lucide React & React Icons
- **Date Handling:** date-fns
- **Utilities:** lodash, clsx, tailwind-merge

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Google Maps API key (for location features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/foodeez.git
cd foodeez
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/          # Next.js app directory
├── components/   # React components
│   ├── core/     # Core components
│   ├── home/     # Home page components
│   ├── layout/   # Layout components
│   └── ui/       # UI components
├── features/     # Feature-specific code
├── lib/          # Utility functions
├── services/     # API services
├── shared/       # Shared resources
└── types/        # TypeScript types
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 License

This is a private project. All rights reserved.

## 🙏 Built With

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma](https://www.prisma.io)
