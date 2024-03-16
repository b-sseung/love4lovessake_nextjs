import '@/styles/globals.css';
import Head from 'next/head';
import { PortfolioProvider } from '../context/context';
import { prefix } from '../config/config';

export default function App({ Component, pageProps }) {
  return (
    <PortfolioProvider value={{ prefix }}>
      <Head>
        <title>연지구 팬페이지</title>
        <link rel="icon" href={`${prefix}/images/icons/logo.jpg`} />
      </Head>
      <Component {...pageProps} />
    </PortfolioProvider>
  );
}
