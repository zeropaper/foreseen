declare module '*.yml' {
  const content: string
  export default content
}

declare module '*.module.css'
{
  const classes: {
    [key: string]: string;
  };
  export default classes;
}

declare module '*.css'
{
}
