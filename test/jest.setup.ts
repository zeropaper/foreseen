
jest.mock('../src/styles.css', () => { });
jest.mock('../src/Controls.module.css', () => ({ locals: {}, toString() { return ''; } }));

export { };
