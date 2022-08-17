export const lightArguments: { [k: string]: string[] } = {
  ambient: ['color', 'intensity'],
  directional: ['color', 'intensity'],
  hemisphere: ['skyColor', 'groundColor', 'intensity'],
  point: ['color', 'intensity', 'distance', 'decay'],
  areaRect: ['color', 'intensity', 'width', 'height'],
  spot: ['color', 'intensity', 'distance', 'angle', 'penumbra', 'decay'],
};
