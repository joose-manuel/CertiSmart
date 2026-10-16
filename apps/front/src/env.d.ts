declare var process: {
  env: {
    NG_APP_ENV: string;
    NG_APP_API_URL: string;
    [key: string]: string | undefined;
  };
};

interface ImportMetaEnv {
  readonly NG_APP_ENV: string;
  readonly NG_APP_API_URL: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
