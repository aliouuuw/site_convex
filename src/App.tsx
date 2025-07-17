import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen antialiased">
      <Navigation />
      <HomePage />
      <Footer />
    </div>
  );
}
