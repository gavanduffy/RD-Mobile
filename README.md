# RD-Mobile - Real-Debrid Manager

A modern, Progressive Web App (PWA) for managing your Real-Debrid account with a beautiful, responsive interface optimized for both desktop and mobile devices.

![Real-Debrid Manager](https://img.shields.io/badge/Real--Debrid-Manager-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

## ✨ Features

- 🌐 **Full Real-Debrid Integration** - Complete access to all Real-Debrid features
- 🎨 **Modern UI/UX** - Beautiful, dark-themed interface built with TailwindCSS
- 📱 **Progressive Web App** - Install on any device for native-like experience
- 🚀 **Fast & Responsive** - Built with Next.js 14 for optimal performance
- 🔒 **Secure** - API key stored locally, never sent to our servers
- 💾 **Offline Support** - Service worker enables offline functionality
- 📊 **Dashboard** - Overview of your account, torrents, and downloads
- 🌐 **Torrent Management** - Add, monitor, and manage torrents
- 📥 **Download Manager** - View and access your unrestricted files
- 🔗 **Link Unrestricter** - Generate premium links from file hosters
- 👤 **Account Info** - View subscription status and traffic usage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Real-Debrid account (get one at [real-debrid.com](https://real-debrid.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gavanduffy/RD-Mobile.git
cd RD-Mobile
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional):
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 🌐 Deploying to Vercel

This app is optimized for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gavanduffy/RD-Mobile)

Or manually:

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure build settings
4. Deploy!

The `vercel.json` file is already configured for optimal deployment.

## 🔑 Getting Your Real-Debrid API Key

1. Log in to your Real-Debrid account
2. Go to [https://real-debrid.com/apitoken](https://real-debrid.com/apitoken)
3. Generate a new API token
4. Copy the token and paste it in the app when prompted

**Note:** Your API key is stored locally in your browser and is never sent to any server other than Real-Debrid's API.

## 📱 Installing as PWA

### Desktop (Chrome/Edge)
1. Open the app in your browser
2. Click the install icon (➕) in the address bar
3. Click "Install"

### Mobile (iOS)
1. Open the app in Safari
2. Tap the share button
3. Tap "Add to Home Screen"

### Mobile (Android)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home Screen"

## 🏗️ Project Structure

```
RD-Mobile/
├── app/                    # Next.js app directory
│   ├── account/           # Account page
│   ├── downloads/         # Downloads manager
│   ├── torrents/          # Torrent manager
│   ├── unrestrict/        # Link unrestricter
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── Navigation.tsx     # Navigation component
├── lib/                   # Core libraries
│   └── realDebridApi.ts   # Real-Debrid API client
├── utils/                 # Utility functions
│   └── formatters.ts      # Formatting helpers
├── public/                # Static files
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   └── icons/            # App icons
├── vercel.json           # Vercel configuration
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies

```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **API Client:** Axios
- **Deployment:** Vercel
- **PWA:** Custom Service Worker

## 📚 API Documentation

This app uses the Real-Debrid REST API v1.0. For more information:
- [Real-Debrid API Documentation](https://api.real-debrid.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

This is an unofficial Real-Debrid client. It is not affiliated with or endorsed by Real-Debrid. Use at your own risk.

## 🙏 Acknowledgments

- Real-Debrid for their excellent service and API
- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [Real-Debrid FAQ](https://real-debrid.com/faq)

---

Made with ❤️ for the Real-Debrid community
