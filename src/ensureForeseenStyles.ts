
export function getStyleSheet(uniqueTitle: string) {
  for (let s = 0; s < document.styleSheets.length; s += 1) {
    if (document.styleSheets[s].title === uniqueTitle) {
      return document.styleSheets[s];
    }
  }
}

export default function ensureForeseenStyles(): CSSStyleSheet {
  let styleEl: HTMLStyleElement = document.head.querySelector('[title="foreseen-styles"]');

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.title = 'foreseen-styles';
    document.head.appendChild(styleEl);
  }

  const styleSheet = getStyleSheet('foreseen-styles');
  styleSheet.insertRule(`.foreseen { position: relative; }`);
  styleSheet.insertRule(`.foreseen, .foreseen * { box-sizing: border-box; width: auto }`);
  styleSheet.insertRule(`.foreseen dialog {
    position: absolute;
    z-index: 1000;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    margin: 0;
    padding: 0;
    border: 1px solid #ccc;
    border-radius: 3px;
    background: #ffffff66;
    backdrop-filter: blur(10px);
    box-shadow: #dfdfdf 0px 2px 4px 2px;
    overflow: auto;
    max-width: 100%;
  }`);
  styleSheet.insertRule(`.foreseen .controls-header {
    display: flex;
    justify-content: flex-end;
    padding: 4px;
  }`);
  styleSheet.insertRule(`.foreseen .controls-header button {
    margin-left: 4px;
  }`);
  styleSheet.insertRule(`.foreseen .controls-content {
    display: block;
  }`);
  styleSheet.insertRule(`.foreseen .foreseen-animation-controls, .foreseen .foreseen-plugin {
    padding: 4px;
  }`);
  styleSheet.insertRule(`.foreseen .foreseen-plugin label {
    display: block;
  }`);
  styleSheet.insertRule(`.foreseen .foreseen-plugin label span {
    display: block;
  }`);
  return styleSheet;
}
