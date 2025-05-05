# 📊 GitHub Profile Analyzer

An interactive tool built with React and Tailwind CSS that fetches and visualizes any GitHub user's profile data using the GitHub API. View top repositories, language distribution, and contribution insights with clean, responsive charts.

## 🚀 Live Demo

👉 [Try it Live](https://krajtilak-git-analyzer.vercel.app)

## ✨ Features

- 🔍 Search any GitHub username
- 📦 View total repositories, stars, forks, followers, etc.
- 📊 Language distribution pie chart
- 🧠 Most starred repositories summary
- ⚡ Real-time data fetched from GitHub API

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS
- **API:** GitHub REST API
- **Charts:** Chart.js or Recharts (specify based on actual library used)
- **Deployment:** Vercel

## 📂 Folder Structure

```

git-analyzer/
├── public/
├── src/
│   ├── components/
│   ├── utils/
│   ├── App.jsx
│   ├── index.js
│   └── styles.css
├── tailwind.config.js
└── package.json

```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/git-analyzer.git
   cd git-analyzer

2. **Install dependencies**

   ```bash
   npm install

   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

## 🔐 Note

* The GitHub API has rate limits for unauthenticated requests (60/hour). To avoid this, you can [generate a GitHub personal access token](https://github.com/settings/tokens) and configure it.

## 📌 Future Enhancements

* Add authenticated requests for higher rate limits
* Support for contribution heatmaps
* Dark mode toggle

## 🧑‍💻 Author

Developed by [K Rajtilak](https://krajtilak.vercel.app)

## 🪪 License

This project is open-source under the [MIT License](LICENSE).

```
