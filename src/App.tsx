import { useEffect } from 'react';
import Calculating from './Calculating';
import Input from './Input';
import Ctx from './Ctx';
import Error from './Error';
import Home from './Home';
import Host from './Host';
import Join from './Join';
import Result from './Result';
import Share from './Share';
import Waiting from './Waiting';
import isKey from './isKey';
import never from './never';
import About from './About';
import Setup from './Setup';
import HostOrJoin from './HostOrJoin';
import CheckTolerance from './CheckTolerance';

function App() {
  const ctx = Ctx.use();
  const page = ctx.page.use();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.hash.slice(1);

    if (isKey(code)) {
      window.location.hash = '';
      ctx.join(code);
    }
  }, [ctx]);

  let content;

  if (page === 'Home') {
    content = <Home />;
  } else if (page === 'Share') {
    content = <Share />;
  } else if (page === 'Host') {
    content = <Host />;
  } else if (page === 'Join') {
    content = <Join />;
  } else if (page === 'Connecting') {
    content = <h1>Connecting...</h1>;
  } else if (page === 'Input') {
    content = <Input />;
  } else if (page === 'Waiting') {
    content = <Waiting />;
  } else if (page === 'Calculating') {
    content = <Calculating />;
  } else if (page === 'Result') {
    content = <Result />;
  } else if (page === 'Error') {
    content = <Error />;
  } else if (page === 'About') {
    content = <About />;
  } else if (page === 'Setup') {
    content = <Setup />;
  } else if (page === 'HostOrJoin') {
    content = <HostOrJoin />;
  } else if (page === 'CheckTolerance') {
    content = <CheckTolerance />;
  } else {
    never(page);
  }

  return <>
    {content}
  </>;
}

export default App;
