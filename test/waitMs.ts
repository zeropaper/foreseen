export default function waitMs(ms: number = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
