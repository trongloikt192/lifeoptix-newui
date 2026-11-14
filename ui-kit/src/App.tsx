import { useEffect, useMemo, useState } from 'react';
import { SafeAreaFrameContext, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { StatusGlyphs } from './icons';
import { KeyboardSimProvider } from './primitives';
import { AccentProvider } from './theme/accent';
import { accentOptions } from './theme/tokens';
import { ToastProvider } from './ui/Feedback';
import { CATALOG, GROUPS } from './gallery/catalog';
import { TodayScreen } from './screens/TodayScreen';

/**
 * Web-only gallery shell: device frame, fake status bar, simulated keyboard,
 * navigation between mockups. None of this ships to RN.
 */

const KEYBOARD_HEIGHT = 336;
/** Insets of the 390 × 844 frame, for react-native-web parts that read react-native-safe-area-context. */
const INSETS = { top: 47, bottom: 34, left: 0, right: 0 };
const FRAME = { x: 0, y: 0, width: 390, height: 844 };
const HOME = { id: 'today', variant: 'screen' };

function readHash() {
  const [, id, variant] = window.location.hash.split('/');
  return id ? { id, variant: variant ?? '' } : HOME;
}

export default function App() {
  const [route, setRoute] = useState(readHash);
  const [accent, setAccent] = useState<string>(accentOptions[0]);
  const [chrome, setChrome] = useState(true);
  const [open, setOpen] = useState(true);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const on = () => setRoute(readHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const item = CATALOG.find((i) => i.id === route.id);
  const variant = item ? (item.variants.find((v) => v.id === route.variant) ?? item.variants[0]) : null;

  useEffect(() => {
    setOpen(true);
    setRun((r) => r + 1);
  }, [route.id, route.variant]);

  const go = (id: string, v?: string) => {
    window.location.hash = `/${id}${v ? `/${v}` : ''}`;
  };

  const keyboard = variant?.keyboard && open ? KEYBOARD_HEIGHT : 0;
  const content = useMemo(
    () => (variant ? variant.render({ open, close: () => setOpen(false) }) : <TodayScreen accent={accent} />),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variant, open, accent, run],
  );

  return (
    <div className="gallery">
      <aside className="sidebar" aria-label="Mockups">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <strong>Daily Log</strong>
            <span>UI kit mockups</span>
          </div>
        </div>
        <button type="button" className={`nav-item ${!item ? 'is-on' : ''}`} onClick={() => go('today')}>
          <span>Today screen</span>
          <small>Màn hình Today</small>
        </button>
        {GROUPS.map((g) => (
          <section key={g.id}>
            <h2>
              {g.title}
              <small>{g.vi}</small>
            </h2>
            {CATALOG.filter((i) => i.group === g.id).map((i) => (
              <button type="button" key={i.id} className={`nav-item ${item?.id === i.id ? 'is-on' : ''}`} aria-current={item?.id === i.id ? 'page' : undefined} onClick={() => go(i.id)}>
                <span>{i.title}</span>
                <small>
                  {i.vi}
                  {i.variants.length > 1 ? ` · ${i.variants.length}` : ''}
                </small>
              </button>
            ))}
          </section>
        ))}
      </aside>

      <label className="picker">
        <span>Mockup</span>
        <select value={item?.id ?? 'today'} onChange={(e) => go(e.target.value)}>
          <option value="today">Today screen</option>
          {GROUPS.map((g) => (
            <optgroup key={g.id} label={g.title}>
              {CATALOG.filter((i) => i.group === g.id).map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title} — {i.vi}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <main className="stage">
        <header className="stage-head">
          <div>
            <h1>{item?.title ?? 'Today — How was your day?'}</h1>
            <p>{item?.vi ?? 'Màn hình chính'}</p>
          </div>
          {item && item.variants.length > 1 && (
            <div className="variants" role="tablist" aria-label="Variants">
              {item.variants.map((v) => (
                <button key={v.id} type="button" role="tab" aria-selected={v.id === variant?.id} className={v.id === variant?.id ? 'is-on' : ''} onClick={() => go(item.id, v.id)}>
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </header>

        <div className="device-wrap">
          <AccentProvider value={accent}>
            <KeyboardSimProvider value={keyboard}>
              <div className="device" key={run}>
                <SafeAreaFrameContext.Provider value={FRAME}>
                  <SafeAreaInsetsContext.Provider value={INSETS}>
                    <ToastProvider>{content}</ToastProvider>
                  </SafeAreaInsetsContext.Provider>
                </SafeAreaFrameContext.Provider>
                <div id="rn-modal-host" className="modal-host" />
                {keyboard > 0 && <MockKeyboard />}
                {chrome && (
                  <>
                    <div className="statusbar" aria-hidden="true">
                      <span className="statusbar-time">10:42</span>
                      <StatusGlyphs />
                    </div>
                    <span className="home-indicator" aria-hidden="true" />
                  </>
                )}
              </div>
            </KeyboardSimProvider>
          </AccentProvider>
          {item && !open && (
            <button type="button" className="replay" onClick={() => { setOpen(true); setRun((r) => r + 1); }}>
              Show it again
            </button>
          )}
        </div>

        <form className="levers" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend>Accent</legend>
            {accentOptions.map((c) => (
              <label key={c} className="swatch" style={{ background: c }}>
                <input type="radio" name="accent" checked={accent === c} onChange={() => setAccent(c)} />
                <span className="sr-only">{c}</span>
              </label>
            ))}
          </fieldset>
          <label className="toggle">
            <input type="checkbox" checked={chrome} onChange={(e) => setChrome(e.target.checked)} />
            Device chrome
          </label>
          {item && (
            <button type="button" className="ghost-btn" onClick={() => { setOpen(true); setRun((r) => r + 1); }}>
              Reset
            </button>
          )}
        </form>
      </main>
    </div>
  );
}

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

/** Drawn iOS-style keyboard (preview only); the app gets the real one. */
function MockKeyboard() {
  return (
    <div className="kb" aria-hidden="true">
      <div className="kb-suggest">
        <span>“bún”</span>
        <span>bún chả</span>
        <span>with</span>
      </div>
      {ROWS.map((r, i) => (
        <div key={r} className="kb-row">
          {i === 2 && <span className="kb-key kb-mod">⇧</span>}
          {r.split('').map((k) => (
            <span key={k} className="kb-key">
              {k}
            </span>
          ))}
          {i === 2 && <span className="kb-key kb-mod">⌫</span>}
        </div>
      ))}
      <div className="kb-row">
        <span className="kb-key kb-mod kb-wide">123</span>
        <span className="kb-key kb-space">space</span>
        <span className="kb-key kb-mod kb-wide">return</span>
      </div>
    </div>
  );
}
