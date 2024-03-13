import '@/styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>연지구 팬페이지</title>
        <link rel="icon" href="/images/icons/logo.jpg" />
      </Head>
      <Component {...pageProps} />;
    </>
  );
}
