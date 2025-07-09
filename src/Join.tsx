import { Scanner } from '@yudiel/react-qr-scanner';
import Ctx from './Ctx';
import { ChangeEvent } from 'react';
import isKey from './isKey';

export default function Join() {
  const ctx = Ctx.use();

  const tryJoin = (text: string) => {
    let key;

    if (/^https?:\/\//.test(text)) {
      const url = new URL(text);
      key = url.hash.slice(1);
    } else {
      key = text;
    }

    if (isKey(key)) {
      ctx.join(key);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "1rem" }}>
      <div className="title">Join</div>
      <div style={{ flexGrow: 1 }} />
      <div>Scan your friend's QR code:</div>
      <Scanner
        onResult={(text, _result) => tryJoin(text)}
        onError={error => console.log(error?.message)}
        components={{
          audio: false,
        }}
      />
      <div>
        Or paste the url here:
        <input
          type='text'
          style={{ width: '100%', boxSizing: 'border-box' }}
          onInput={(ev: ChangeEvent<HTMLInputElement>) => {
            tryJoin(ev.target.value);
          }}
        />
      </div>
      <div style={{ flexGrow: 2 }} />
      <button className="secondary" onClick={() => ctx.page.set("Home")} style={{ width: "100%" }}>
        Cancel
      </button>
    </div>
  );
}
