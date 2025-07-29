import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 Starting React app...');

try {
  console.log('📝 Creating React root...');
  const root = createRoot(document.getElementById("root")!);
  console.log('📝 Rendering App component...');
  root.render(<App />);
  console.log('✅ React app rendered successfully');
} catch (error) {
  console.error('❌ Error rendering React app:', error);
  document.getElementById("root")!.innerHTML = '<div style="padding: 20px; color: red;">❌ Error loading app: ' + error + '</div>';
}
