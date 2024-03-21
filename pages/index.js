import Home from '@/components/Home';
import localFont from 'next/font/local';

const continuousFont = localFont({
  src: [
    {
      path: '../public/fonts/continuous.ttf',
    },
    {
      path: '../public/fonts/continuous.otf',
    },
  ],
  variable: '--continuous-font',
  display: 'swap',
});

const index = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }} className={continuousFont.variable}>
      <Home></Home>
    </div>
  );
};

export default index;
