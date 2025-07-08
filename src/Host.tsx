import CopyToClipboard from 'react-copy-to-clipboard';
import Ctx from './Ctx';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect } from 'react';

export default function Host() {
  const ctx = Ctx.use();
  const key = ctx.key.use();

  const code = key.base58();
  const inviteLink = `${window.location.origin}${window.location.pathname}#${code}`;

  useEffect(() => {
    ctx.host();
  }, [ctx]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "1rem" }}>
      <div className="title">Host</div>
      <div style={{ flexGrow: 1 }} />
      <div>
        Get your peer to scan:
      </div>
      <QRCodeCanvas
        style={{ width: '100%', height: 'auto' }}
        bgColor='transparent'
        value={inviteLink}
      />
      <div>
        Or <CopyToClipboard text={inviteLink}>
          <button style={{ padding: '0.5rem', fontSize: "1rem" }}>copy this link</button>
        </CopyToClipboard> and send it to them.
      </div>
      <div style={{ flexGrow: 2 }} />
      <button className="secondary" onClick={() => ctx.reset()}>Cancel</button>
    </div>
  );
}
