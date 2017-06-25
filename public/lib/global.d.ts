interface Window {
  config: {
    relative_path: string,
  };
  app: {
    alertSuccess(message?: string): void,
    alertError(message?: string): void,
    alertError(error: Error): void,
  };
  templates: {
    parse(template: string, data: any, callback: Callback<string>): void,
  };
}
