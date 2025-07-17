// pages/_app.js
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </Layout>
  );
}

export default MyApp;