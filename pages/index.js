import Home from '@/components/Home';
import localFont from 'next/font/local';

const continuousFont = localFont({
  src: [
    {
      path: '../public/fonts/continuous.otf',
    },
    {
      path: '../public/fonts/continuous.ttf',
    },
  ],
  variable: '--continuous-font',
  display: 'swap',
});

const dancingscriptFont = localFont({
  src: [
    {
      path: '../public/fonts/DancingScript-Bold.ttf',
    },
  ],
  variable: '--dancing-script-font',
  display: 'swap',
});

const index = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }} className={dancingscriptFont.variable}>
      <Home></Home>
    </div>
  );
};

export default index;
