import Ctx from './Ctx';
import { QRCodeCanvas } from 'qrcode.react';

export default function Host() {
  const ctx = Ctx.use();

  return (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', flexGrow: 1 }}>
      <h1>Share</h1>
      <div style={{ flexGrow: 1 }} />
      <center>
        <QRCodeCanvas
          style={{ width: '100%', height: 'auto' }}
          bgColor='transparent'
          value={window.location.href}
        />
      </center>
      <a style={{ textAlign: 'center' }} href={window.location.href}>
        {window.location.href}
      </a>
      <div style={{ flexGrow: 2 }} />
      <button style={{ width: '100%' }} onClick={() => ctx.page.set('Home')}>
        Home
      </button>
    </div>
  );
}
